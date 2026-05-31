import {
  quoteTotals, invoiceTotals, invoiceView, invoicedQuoteIds,
  nextInvoiceNumber, nextQuoteNumber, computeDashboardStats, computeRecentActivity,
  computeClientTotals, initials, migrateQuotes, needsMigration,
} from './workspace';
import type { Quote, Invoice } from '../types';

let mockSeq = 0;
jest.mock('./uuid', () => ({ uuid: () => `uuid-${++mockSeq}` }));
beforeEach(() => { mockSeq = 0; });

const DAY = 86400000;
const iso = (offsetDays: number) => new Date(Date.now() + offsetDays * DAY).toISOString();

const quote = (over: Partial<Quote> = {}): Quote => ({
  id: 'q1', number: 1001, clientId: 'c1', job: 'Job', lineItems: [], taxRate: 0,
  total: 0, status: 'draft', createdAt: iso(0), updatedAt: iso(0), ...over,
});
const invoice = (over: Partial<Invoice> = {}): Invoice => ({
  id: 'i1', number: 2001, clientId: 'c1', job: 'Job', amount: 0, lineItems: [],
  taxRate: 0, status: 'pending', dueAt: iso(5), createdAt: iso(0), ...over,
});

describe('totals', () => {
  it('quoteTotals applies tax to the line-item subtotal', () => {
    const q = quote({ lineItems: [{ id: 'l1', description: 'x', quantity: 2, unitPrice: 100 }], taxRate: 10 });
    expect(quoteTotals(q)).toEqual({ subtotal: 200, tax: 20, total: 220 });
  });
  it('invoiceTotals mirrors quote math', () => {
    const i = invoice({ lineItems: [{ id: 'l1', description: 'x', quantity: 1, unitPrice: 50 }], taxRate: 0 });
    expect(invoiceTotals(i).total).toBe(50);
  });
});

describe('invoiceView', () => {
  it('pending + past due → overdue', () => {
    expect(invoiceView(invoice({ status: 'pending', dueAt: iso(-2) }))).toBe('overdue');
  });
  it('pending + future due → pending', () => {
    expect(invoiceView(invoice({ status: 'pending', dueAt: iso(5) }))).toBe('pending');
  });
  it('paid stays paid regardless of due date', () => {
    expect(invoiceView(invoice({ status: 'paid', dueAt: iso(-9) }))).toBe('paid');
  });
});

describe('counters', () => {
  it('invoicedQuoteIds collects linked quote ids', () => {
    const ids = invoicedQuoteIds([invoice({ quoteId: 'q1' }), invoice({ quoteId: undefined })]);
    expect(ids.has('q1')).toBe(true);
    expect(ids.size).toBe(1);
  });
  it('nextInvoiceNumber / nextQuoteNumber are max+1', () => {
    expect(nextInvoiceNumber([invoice({ number: 2031 })])).toBe(2032);
    expect(nextQuoteNumber([quote({ number: 1048 })])).toBe(1049);
  });
  it('numbers fall back to a base when empty', () => {
    expect(nextInvoiceNumber([])).toBe(2001);
    expect(nextQuoteNumber([])).toBe(1001);
  });
});

describe('dashboardStats', () => {
  it('rolls up outstanding, overdue, pending, and ready-to-bill', () => {
    const quotes = [
      quote({ id: 'qa', status: 'approved', total: 500 }),         // ready (uninvoiced)
      quote({ id: 'qb', status: 'approved', total: 999 }),         // invoiced → not ready
      quote({ id: 'qc', status: 'draft', total: 100 }),
    ];
    const invoices = [
      invoice({ id: 'i-over', status: 'pending', dueAt: iso(-3), amount: 1000 }),
      invoice({ id: 'i-pend', status: 'pending', dueAt: iso(4), amount: 400 }),
      invoice({ id: 'i-paid', status: 'paid', dueAt: iso(-1), amount: 700, quoteId: 'qb' }),
    ];
    const s = computeDashboardStats(quotes, invoices);
    expect(s.overdueCount).toBe(1);
    expect(s.overdueAmount).toBe(1000);
    expect(s.pendingCount).toBe(1);
    expect(s.pendingAmount).toBe(400);
    expect(s.outstanding).toBe(1400);
    expect(s.readyCount).toBe(1);
    expect(s.readyAmount).toBe(500);
  });
});

describe('recentActivity', () => {
  it('merges quotes + invoices newest first, capped at limit', () => {
    const quotes = [quote({ id: 'q-old', createdAt: iso(-10) })];
    const invoices = [invoice({ id: 'i-new', createdAt: iso(-1), paidAt: undefined })];
    const feed = computeRecentActivity(quotes, invoices, 4);
    expect(feed[0].id).toBe('i-new');
    expect(feed[1].id).toBe('q-old');
  });
});

describe('clientTotals', () => {
  it('sums quoted / invoiced / paid for one client', () => {
    const quotes = [quote({ id: 'q', clientId: 'c1', total: 300 }), quote({ id: 'q2', clientId: 'c2', total: 9 })];
    const invoices = [
      invoice({ id: 'i', clientId: 'c1', amount: 300, status: 'paid' }),
      invoice({ id: 'i2', clientId: 'c1', amount: 100, status: 'pending' }),
    ];
    const t = computeClientTotals('c1', quotes, invoices);
    expect(t.quoted).toBe(300);
    expect(t.invoiced).toBe(400);
    expect(t.paid).toBe(300);
    expect(t.jobCount).toBe(1);
  });
});

describe('initials', () => {
  it('derives two letters', () => {
    expect(initials('Maria Gutierrez')).toBe('MG');
    expect(initials('Cobblestone')).toBe('CO');
    expect(initials('')).toBe('?');
  });
});

describe('migration', () => {
  it('needsMigration detects legacy quotes (no number field)', () => {
    expect(needsMigration([{ id: 'x', clientName: 'A' }])).toBe(true);
    expect(needsMigration([{ id: 'x', number: 1001 }])).toBe(false);
    expect(needsMigration([])).toBe(false);
  });
  it('migrateQuotes derives clients, assigns numbers, computes totals', () => {
    const legacy = [
      { id: 'q1', clientName: 'Maria Gutierrez', jobDescription: 'Paint', taxRate: 0, status: 'sent', createdAt: iso(-2),
        lineItems: [{ id: 'l1', description: 'paint', quantity: 1, unitPrice: 420 }] },
      { id: 'q2', clientName: 'Maria Gutierrez', jobDescription: 'Tile', taxRate: 0, status: 'draft', createdAt: iso(-1),
        lineItems: [{ id: 'l2', description: 'tile', quantity: 1, unitPrice: 100 }] },
      { id: 'q3', clientName: '', jobDescription: 'No client', taxRate: 0, status: 'draft', createdAt: iso(0), lineItems: [] },
    ];
    const { quotes, clients } = migrateQuotes(legacy as never);
    // one client for the two Maria quotes, none for the empty-name quote
    expect(clients).toHaveLength(1);
    expect(clients[0].name).toBe('Maria Gutierrez');
    const maria = clients[0].id;
    const byId = Object.fromEntries(quotes.map(q => [q.id, q]));
    expect(byId.q1.clientId).toBe(maria);
    expect(byId.q2.clientId).toBe(maria);
    expect(byId.q3.clientId).toBeNull();
    expect(byId.q1.total).toBe(420);
    expect(byId.q1.job).toBe('Paint');
    // numbers assigned sequentially by createdAt
    expect(byId.q1.number).toBe(1001);
    expect(byId.q3.number).toBe(1003);
  });
});
