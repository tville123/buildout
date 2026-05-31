import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkspaceProvider, useWorkspace } from './WorkspaceContext';

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Jest mock factory only allows variables prefixed with "mock" in its closure
let mockUuidSeq = 0;
jest.mock('../utils/uuid', () => ({
  uuid: () => `uuid-${++mockUuidSeq}`,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WorkspaceProvider>{children}</WorkspaceProvider>
);

async function renderWorkspaceHook() {
  const hook = renderHook(() => useWorkspace(), { wrapper });
  await act(async () => {}); // drain the load effect
  return hook;
}

beforeEach(async () => {
  mockUuidSeq = 0;
  await AsyncStorage.clear();
});

describe('WorkspaceContext — quotes', () => {
  it('createQuote adds a quote with new-shape defaults', async () => {
    const { result } = await renderWorkspaceHook();
    let quote: ReturnType<typeof result.current.createQuote>;
    await act(async () => { quote = result.current.createQuote(); });

    expect(quote!).toMatchObject({
      clientId: null,
      job: '',
      lineItems: [],
      taxRate: 8.25,
      total: 0,
      status: 'draft',
      number: 1001,
    });
    expect(result.current.quotes).toHaveLength(1);
  });

  it('updateQuote merges patch and recomputes total', async () => {
    const { result } = await renderWorkspaceHook();
    let id = '';
    await act(async () => { id = result.current.createQuote().id; });
    await act(async () => {
      result.current.updateQuote(id, {
        job: 'Repaint',
        taxRate: 10,
        lineItems: [{ id: 'l1', description: 'paint', quantity: 2, unitPrice: 100 }],
      });
    });
    const q = result.current.getQuote(id);
    expect(q?.job).toBe('Repaint');
    expect(q?.total).toBe(220); // 200 + 10% tax
    expect(q?.status).toBe('draft');
  });

  it('addToQuote creates an unassigned draft when none active', async () => {
    const { result } = await renderWorkspaceHook();
    await act(async () => {
      result.current.addToQuote({ source: 'Paint', items: [{ description: '2 gal', quantity: 1, unitPrice: 45 }] });
    });
    expect(result.current.quotes).toHaveLength(1);
    expect(result.current.quotes[0].clientId).toBeNull();
    expect(result.current.quotes[0].lineItems).toHaveLength(1);
    expect(result.current.quotes[0].total).toBeCloseTo(48.71, 2); // 45 + default 8.25% tax
    expect(result.current.activeQuoteId).toBe(result.current.quotes[0].id);
  });

  it('addToQuote appends to an existing active draft', async () => {
    const { result } = await renderWorkspaceHook();
    let id = '';
    await act(async () => { id = result.current.createQuote().id; });
    await act(async () => { result.current.setActiveQuoteId(id); });
    await act(async () => {
      result.current.addToQuote({ source: 'Tile', items: [
        { description: 'Box', quantity: 6, unitPrice: 30 },
        { description: 'Grout', quantity: 2, unitPrice: 15 },
      ] });
    });
    expect(result.current.quotes).toHaveLength(1);
    expect(result.current.getQuote(id)?.lineItems).toHaveLength(2);
  });

  it('deleteQuote clears activeQuoteId when active', async () => {
    const { result } = await renderWorkspaceHook();
    let id = '';
    await act(async () => { id = result.current.createQuote().id; });
    await act(async () => { result.current.setActiveQuoteId(id); });
    await act(async () => { result.current.deleteQuote(id); });
    expect(result.current.activeQuoteId).toBeNull();
    expect(result.current.quotes).toHaveLength(0);
  });
});

describe('WorkspaceContext — clients', () => {
  it('createClient derives initials and prepends', async () => {
    const { result } = await renderWorkspaceHook();
    let c: ReturnType<typeof result.current.createClient>;
    await act(async () => { c = result.current.createClient({ name: 'James Thornton' }); });
    expect(c!.initials).toBe('JT');
    expect(result.current.clients).toHaveLength(1);
    expect(result.current.clientName(c!.id)).toBe('James Thornton');
  });
});

describe('WorkspaceContext — invoices + conversion', () => {
  it('convertQuoteToInvoice copies line items and links the quote', async () => {
    const { result } = await renderWorkspaceHook();
    let cid = '', qid = '';
    await act(async () => { cid = result.current.createClient({ name: 'Maria G' }).id; });
    await act(async () => { qid = result.current.createQuote().id; });
    await act(async () => {
      result.current.updateQuote(qid, {
        clientId: cid, job: 'Paint', status: 'approved',
        lineItems: [{ id: 'l1', description: 'paint', quantity: 1, unitPrice: 400 }],
        taxRate: 0,
      });
    });
    await act(async () => {
      result.current.convertQuoteToInvoice(qid, { termDays: 15, deposit: false });
    });
    expect(result.current.invoices).toHaveLength(1);
    const inv = result.current.invoices[0];
    expect(inv.quoteId).toBe(qid);
    expect(inv.amount).toBe(400);
    expect(inv.status).toBe('pending');
    expect(inv.lineItems).toHaveLength(1);
    expect(result.current.invoicedIds.has(qid)).toBe(true);
  });

  it('convertQuoteToInvoice with deposit bills a single 50% line', async () => {
    const { result } = await renderWorkspaceHook();
    let qid = '';
    await act(async () => { qid = result.current.createQuote().id; });
    await act(async () => {
      result.current.updateQuote(qid, {
        job: 'Tile', status: 'approved',
        lineItems: [{ id: 'l1', description: 'tile', quantity: 1, unitPrice: 3200 }],
        taxRate: 0,
      });
    });
    await act(async () => {
      result.current.convertQuoteToInvoice(qid, { termDays: 30, deposit: true });
    });
    const inv = result.current.invoices[0];
    expect(inv.amount).toBe(1600);
    expect(inv.lineItems).toHaveLength(1);
    expect(inv.lineItems[0].description).toContain('50% deposit');
  });

  it('markInvoicePaid moves status to paid', async () => {
    const { result } = await renderWorkspaceHook();
    let iid = '';
    await act(async () => { iid = result.current.createInvoice({ job: 'x', amount: 100 }).id; });
    await act(async () => { result.current.markInvoicePaid(iid); });
    const inv = result.current.getInvoice(iid);
    expect(inv?.status).toBe('paid');
    expect(inv?.paidAt).toBeTruthy();
  });
});

describe('WorkspaceContext — migration on load', () => {
  it('migrates legacy quotes from storage and derives a client', async () => {
    await AsyncStorage.setItem('buildout.quotes', JSON.stringify([
      { id: 'old-1', clientName: 'Rena D.', jobDescription: 'Drywall', taxRate: 0, status: 'sent',
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        lineItems: [{ id: 'l1', description: 'patch', quantity: 1, unitPrice: 680 }] },
    ]));
    const { result } = await renderWorkspaceHook();
    expect(result.current.quotes).toHaveLength(1);
    expect(result.current.quotes[0].number).toBe(1001);
    expect(result.current.quotes[0].total).toBe(680);
    expect(result.current.clients).toHaveLength(1);
    expect(result.current.clients[0].name).toBe('Rena D.');
    expect(result.current.quotes[0].clientId).toBe(result.current.clients[0].id);
  });
});

describe('WorkspaceContext — guard', () => {
  it('useWorkspace throws outside provider', () => {
    expect(() => renderHook(() => useWorkspace())).toThrow(
      'useWorkspace must be used within WorkspaceProvider'
    );
  });
});
