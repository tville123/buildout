import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuoteProvider, useQuote } from './QuoteContext';

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
  <QuoteProvider>{children}</QuoteProvider>
);

// Renders the hook and flushes the initial AsyncStorage load effect.
async function renderQuoteHook() {
  const hook = renderHook(() => useQuote(), { wrapper });
  await act(async () => {}); // drain the useEffect .then() callback
  return hook;
}

beforeEach(async () => {
  mockUuidSeq = 0;
  await AsyncStorage.clear();
});

describe('QuoteContext', () => {
  it('createQuote adds a quote with correct defaults', async () => {
    const { result } = await renderQuoteHook();

    let quote: ReturnType<typeof result.current.createQuote>;
    await act(async () => {
      quote = result.current.createQuote();
    });

    expect(quote!).toMatchObject({
      id: 'uuid-1',
      clientName: '',
      jobDescription: '',
      lineItems: [],
      taxRate: 8.25,
      status: 'draft',
    });
    expect(result.current.quotes).toHaveLength(1);
  });

  it('updateQuote merges the patch into the target quote', async () => {
    const { result } = await renderQuoteHook();

    await act(async () => { result.current.createQuote(); });
    await act(async () => {
      result.current.updateQuote('uuid-1', { clientName: 'Jane Doe', taxRate: 10 });
    });

    const updated = result.current.getQuote('uuid-1');
    expect(updated?.clientName).toBe('Jane Doe');
    expect(updated?.taxRate).toBe(10);
    expect(updated?.status).toBe('draft'); // untouched field preserved
  });

  it('updateQuote does not touch other quotes', async () => {
    const { result } = await renderQuoteHook();

    await act(async () => { result.current.createQuote(); }); // uuid-1
    await act(async () => { result.current.createQuote(); }); // uuid-2
    await act(async () => {
      result.current.updateQuote('uuid-1', { clientName: 'Target' });
    });

    expect(result.current.getQuote('uuid-2')?.clientName).toBe('');
  });

  it('deleteQuote removes the quote from the list', async () => {
    const { result } = await renderQuoteHook();

    await act(async () => { result.current.createQuote(); });
    expect(result.current.quotes).toHaveLength(1);

    await act(async () => { result.current.deleteQuote('uuid-1'); });
    expect(result.current.quotes).toHaveLength(0);
  });

  it('deleteQuote clears activeQuoteId when the active quote is deleted', async () => {
    const { result } = await renderQuoteHook();

    await act(async () => { result.current.createQuote(); });
    await act(async () => { result.current.setActiveQuoteId('uuid-1'); });
    expect(result.current.activeQuoteId).toBe('uuid-1');

    await act(async () => { result.current.deleteQuote('uuid-1'); });
    expect(result.current.activeQuoteId).toBeNull();
  });

  it('addToQuote creates a new draft when there is no active quote', async () => {
    const { result } = await renderQuoteHook();

    await act(async () => {
      result.current.addToQuote({
        source: 'Paint',
        items: [{ description: '2 gal paint', quantity: 1, unitPrice: 45 }],
      });
    });

    expect(result.current.quotes).toHaveLength(1);
    expect(result.current.quotes[0].lineItems).toHaveLength(1);
    expect(result.current.quotes[0].lineItems[0].description).toBe('2 gal paint');
    expect(result.current.activeQuoteId).toBe('uuid-2'); // uuid-1 is line item id, uuid-2 is the draft id
  });

  it('addToQuote appends line items to an existing active draft', async () => {
    const { result } = await renderQuoteHook();

    await act(async () => { result.current.createQuote(); }); // uuid-1
    await act(async () => { result.current.setActiveQuoteId('uuid-1'); });
    await act(async () => {
      result.current.addToQuote({
        source: 'Tile',
        items: [
          { description: 'Box of tile', quantity: 6, unitPrice: 30 },
          { description: 'Grout bag', quantity: 2, unitPrice: 15 },
        ],
      });
    });

    expect(result.current.quotes).toHaveLength(1); // no new quote created
    const quote = result.current.getQuote('uuid-1');
    expect(quote?.lineItems).toHaveLength(2);
  });

  it('getQuote returns undefined for an unknown id', async () => {
    const { result } = await renderQuoteHook();
    expect(result.current.getQuote('nonexistent')).toBeUndefined();
  });

  it('useQuote throws when called outside QuoteProvider', () => {
    expect(() => renderHook(() => useQuote())).toThrow(
      'useQuote must be used within QuoteProvider'
    );
  });
});
