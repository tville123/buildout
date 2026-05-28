import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Quote, LineItem } from '../types';

const STORAGE_KEY = 'buildout.quotes';

function uuid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

interface AddToQuotePayload {
  source: string;
  items: Omit<LineItem, 'id'>[];
}

interface QuoteContextValue {
  quotes: Quote[];
  activeQuoteId: string | null;
  getQuote: (id: string) => Quote | undefined;
  createQuote: () => Quote;
  updateQuote: (id: string, patch: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  addToQuote: (payload: AddToQuotePayload) => void;
  setActiveQuoteId: (id: string | null) => void;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function useQuote(): QuoteContextValue {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error('useQuote must be used within QuoteProvider');
  return ctx;
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try { setQuotes(JSON.parse(raw)); } catch {}
      }
    });
  }, []);

  const persist = useCallback((next: Quote[]) => {
    setQuotes(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const getQuote = useCallback((id: string) => quotes.find(q => q.id === id), [quotes]);

  const createQuote = useCallback((): Quote => {
    const now = new Date().toISOString();
    const q: Quote = {
      id: uuid(),
      clientName: '',
      jobDescription: '',
      lineItems: [],
      taxRate: 8.25,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };
    persist([q, ...quotes]);
    return q;
  }, [quotes, persist]);

  const updateQuote = useCallback((id: string, patch: Partial<Quote>) => {
    const now = new Date().toISOString();
    persist(quotes.map(q => q.id === id ? { ...q, ...patch, updatedAt: now } : q));
  }, [quotes, persist]);

  const deleteQuote = useCallback((id: string) => {
    persist(quotes.filter(q => q.id !== id));
    if (activeQuoteId === id) setActiveQuoteId(null);
  }, [quotes, activeQuoteId, persist]);

  const addToQuote = useCallback((payload: AddToQuotePayload) => {
    const items: LineItem[] = payload.items.map(i => ({ ...i, id: uuid() }));
    const now = new Date().toISOString();

    // Find or create the active draft
    let targetId = activeQuoteId;
    let existing = targetId ? quotes.find(q => q.id === targetId) : null;

    if (!existing || existing.status !== 'draft') {
      const draft: Quote = {
        id: uuid(),
        clientName: '',
        jobDescription: '',
        lineItems: items,
        taxRate: 8.25,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
      };
      persist([draft, ...quotes]);
      setActiveQuoteId(draft.id);
      return;
    }

    persist(quotes.map(q =>
      q.id === targetId
        ? { ...q, lineItems: [...q.lineItems, ...items], updatedAt: now }
        : q
    ));
  }, [quotes, activeQuoteId, persist]);

  return (
    <QuoteContext.Provider value={{ quotes, activeQuoteId, getQuote, createQuote, updateQuote, deleteQuote, addToQuote, setActiveQuoteId }}>
      {children}
    </QuoteContext.Provider>
  );
}
