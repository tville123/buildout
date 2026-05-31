import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Client, Quote, Invoice, LineItem, PaymentTerm } from '../types';
import { uuid } from '../utils/uuid';
import {
  quoteTotals, computeDashboardStats, computeRecentActivity, computeClientTotals,
  invoicedQuoteIds, nextInvoiceNumber, nextQuoteNumber, initials as deriveInitials,
  migrateQuotes, needsMigration,
  type DashboardStats, type ActivityItem, type ClientTotals,
} from '../utils/workspace';

const KEYS = {
  clients: 'buildout.clients',
  quotes: 'buildout.quotes',
  invoices: 'buildout.invoices',
  schema: 'buildout.schemaVersion',
};
const CURRENT_SCHEMA = '2';

interface AddToQuotePayload {
  source: string;
  items: Omit<LineItem, 'id'>[];
}

interface ConvertOptions {
  termDays: PaymentTerm;
  deposit: boolean;
}

interface WorkspaceContextValue {
  clients: Client[];
  quotes: Quote[];
  invoices: Invoice[];
  activeQuoteId: string | null;

  // clients
  getClient: (id: string | null | undefined) => Client | undefined;
  clientName: (id: string | null | undefined) => string;
  createClient: (patch: { name: string; phone?: string; email?: string }) => Client;
  updateClient: (id: string, patch: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // quotes
  getQuote: (id: string) => Quote | undefined;
  createQuote: () => Quote;
  updateQuote: (id: string, patch: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  addToQuote: (payload: AddToQuotePayload) => void;
  setActiveQuoteId: (id: string | null) => void;

  // invoices
  getInvoice: (id: string) => Invoice | undefined;
  createInvoice: (patch: Partial<Invoice>) => Invoice;
  updateInvoice: (id: string, patch: Partial<Invoice>) => void;
  markInvoicePaid: (id: string) => void;
  convertQuoteToInvoice: (quoteId: string, opts: ConvertOptions) => Invoice | undefined;

  // derived
  dashboardStats: DashboardStats;
  recentActivity: ActivityItem[];
  invoicedIds: Set<string>;
  nextInvoiceNumber: number;
  clientTotals: (clientId: string) => ClientTotals;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return ctx;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);

  // Load + migrate on mount
  useEffect(() => {
    (async () => {
      try {
        const [rawClients, rawQuotes, rawInvoices, schema] = await Promise.all([
          AsyncStorage.getItem(KEYS.clients),
          AsyncStorage.getItem(KEYS.quotes),
          AsyncStorage.getItem(KEYS.invoices),
          AsyncStorage.getItem(KEYS.schema),
        ]);

        const parsedClients: Client[] = rawClients ? JSON.parse(rawClients) : [];
        const parsedQuotes: unknown[] = rawQuotes ? JSON.parse(rawQuotes) : [];
        const parsedInvoices: Invoice[] = rawInvoices ? JSON.parse(rawInvoices) : [];

        if (schema !== CURRENT_SCHEMA && needsMigration(parsedQuotes)) {
          const { quotes: migratedQuotes, clients: derivedClients } = migrateQuotes(parsedQuotes);
          const mergedClients = [...parsedClients, ...derivedClients];
          setClients(mergedClients);
          setQuotes(migratedQuotes);
          setInvoices(parsedInvoices);
          await Promise.all([
            AsyncStorage.setItem(KEYS.clients, JSON.stringify(mergedClients)),
            AsyncStorage.setItem(KEYS.quotes, JSON.stringify(migratedQuotes)),
            AsyncStorage.setItem(KEYS.schema, CURRENT_SCHEMA),
          ]);
        } else {
          setClients(parsedClients);
          setQuotes(parsedQuotes as Quote[]);
          setInvoices(parsedInvoices);
          if (schema !== CURRENT_SCHEMA) AsyncStorage.setItem(KEYS.schema, CURRENT_SCHEMA);
        }
      } catch (e) {
        console.error('[WorkspaceContext] Failed to load/migrate workspace data', e);
      }
    })();
  }, []);

  const persistClients = useCallback((next: Client[]) => {
    setClients(next);
    AsyncStorage.setItem(KEYS.clients, JSON.stringify(next)).catch(
      e => console.error('[WorkspaceContext] Failed to persist clients', e));
  }, []);
  const persistQuotes = useCallback((next: Quote[]) => {
    setQuotes(next);
    AsyncStorage.setItem(KEYS.quotes, JSON.stringify(next)).catch(
      e => console.error('[WorkspaceContext] Failed to persist quotes', e));
  }, []);
  const persistInvoices = useCallback((next: Invoice[]) => {
    setInvoices(next);
    AsyncStorage.setItem(KEYS.invoices, JSON.stringify(next)).catch(
      e => console.error('[WorkspaceContext] Failed to persist invoices', e));
  }, []);

  // ── Clients ──
  const getClient = useCallback(
    (id: string | null | undefined) => (id ? clients.find(c => c.id === id) : undefined),
    [clients]);
  const clientName = useCallback(
    (id: string | null | undefined) => getClient(id)?.name ?? 'Unassigned',
    [getClient]);

  const createClient = useCallback((patch: { name: string; phone?: string; email?: string }): Client => {
    const client: Client = {
      id: uuid(),
      name: patch.name,
      phone: patch.phone ?? '',
      email: patch.email ?? '',
      initials: deriveInitials(patch.name),
    };
    persistClients([client, ...clients]);
    return client;
  }, [clients, persistClients]);

  const updateClient = useCallback((id: string, patch: Partial<Client>) => {
    persistClients(clients.map(c => {
      if (c.id !== id) return c;
      const merged = { ...c, ...patch };
      if (patch.name !== undefined) merged.initials = deriveInitials(patch.name);
      return merged;
    }));
  }, [clients, persistClients]);

  const deleteClient = useCallback((id: string) => {
    persistClients(clients.filter(c => c.id !== id));
  }, [clients, persistClients]);

  // ── Quotes ──
  const getQuote = useCallback((id: string) => quotes.find(q => q.id === id), [quotes]);

  const createQuote = useCallback((): Quote => {
    const now = new Date().toISOString();
    const q: Quote = {
      id: uuid(),
      number: nextQuoteNumber(quotes),
      clientId: null,
      job: '',
      lineItems: [],
      taxRate: 8.25,
      total: 0,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };
    persistQuotes([q, ...quotes]);
    return q;
  }, [quotes, persistQuotes]);

  const updateQuote = useCallback((id: string, patch: Partial<Quote>) => {
    const now = new Date().toISOString();
    persistQuotes(quotes.map(q => {
      if (q.id !== id) return q;
      const merged = { ...q, ...patch, updatedAt: now };
      merged.total = quoteTotals(merged).total;
      return merged;
    }));
  }, [quotes, persistQuotes]);

  const deleteQuote = useCallback((id: string) => {
    persistQuotes(quotes.filter(q => q.id !== id));
    if (activeQuoteId === id) setActiveQuoteId(null);
  }, [quotes, activeQuoteId, persistQuotes]);

  const addToQuote = useCallback((payload: AddToQuotePayload) => {
    const items: LineItem[] = payload.items.map(i => ({ ...i, id: uuid() }));
    const now = new Date().toISOString();
    const existing = activeQuoteId ? quotes.find(q => q.id === activeQuoteId) : null;

    if (!existing || existing.status !== 'draft') {
      const lineItems = items;
      const draft: Quote = {
        id: uuid(),
        number: nextQuoteNumber(quotes),
        clientId: null,
        job: '',
        lineItems,
        taxRate: 8.25,
        total: quoteTotals({ lineItems, taxRate: 8.25 }).total,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
      };
      persistQuotes([draft, ...quotes]);
      setActiveQuoteId(draft.id);
      return;
    }

    persistQuotes(quotes.map(q => {
      if (q.id !== activeQuoteId) return q;
      const lineItems = [...q.lineItems, ...items];
      return { ...q, lineItems, total: quoteTotals({ lineItems, taxRate: q.taxRate }).total, updatedAt: now };
    }));
  }, [quotes, activeQuoteId, persistQuotes]);

  // ── Invoices ──
  const getInvoice = useCallback((id: string) => invoices.find(i => i.id === id), [invoices]);

  const createInvoice = useCallback((patch: Partial<Invoice>): Invoice => {
    const now = new Date().toISOString();
    const lineItems = patch.lineItems ?? [];
    const taxRate = patch.taxRate ?? 0;
    const inv: Invoice = {
      id: uuid(),
      number: nextInvoiceNumber(invoices),
      clientId: patch.clientId ?? null,
      quoteId: patch.quoteId,
      job: patch.job ?? '',
      amount: patch.amount ?? quoteTotals({ lineItems, taxRate }).total,
      lineItems,
      taxRate,
      status: patch.status ?? 'pending',
      dueAt: patch.dueAt ?? new Date(Date.now() + 15 * 86400000).toISOString(),
      paidAt: patch.paidAt,
      createdAt: now,
    };
    persistInvoices([inv, ...invoices]);
    return inv;
  }, [invoices, persistInvoices]);

  const updateInvoice = useCallback((id: string, patch: Partial<Invoice>) => {
    persistInvoices(invoices.map(i => i.id === id ? { ...i, ...patch } : i));
  }, [invoices, persistInvoices]);

  const markInvoicePaid = useCallback((id: string) => {
    const now = new Date().toISOString();
    persistInvoices(invoices.map(i => i.id === id ? { ...i, status: 'paid', paidAt: now } : i));
  }, [invoices, persistInvoices]);

  const convertQuoteToInvoice = useCallback((quoteId: string, opts: ConvertOptions): Invoice | undefined => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote || quote.status !== 'approved') return undefined;
    const now = Date.now();
    const dueAt = new Date(now + opts.termDays * 86400000).toISOString();

    let lineItems: LineItem[];
    let amount: number;
    let job = quote.job;
    let taxRate = quote.taxRate;
    if (opts.deposit) {
      amount = Math.round(quote.total / 2);
      lineItems = [{ id: uuid(), description: `50% deposit — ${quote.job} (quote #${quote.number})`, quantity: 1, unitPrice: amount }];
      taxRate = 0;
      job = `${quote.job} — deposit`;
    } else {
      amount = quote.total;
      lineItems = quote.lineItems.map(li => ({ ...li, id: uuid() }));
    }

    const inv: Invoice = {
      id: uuid(),
      number: nextInvoiceNumber(invoices),
      clientId: quote.clientId,
      quoteId: quote.id,
      job,
      amount,
      lineItems,
      taxRate,
      status: 'pending',
      dueAt,
      createdAt: new Date(now).toISOString(),
    };
    persistInvoices([inv, ...invoices]);
    return inv;
  }, [quotes, invoices, persistInvoices]);

  // ── Derived ──
  const dashboardStats = useMemo(() => computeDashboardStats(quotes, invoices), [quotes, invoices]);
  const recentActivity = useMemo(() => computeRecentActivity(quotes, invoices, 4), [quotes, invoices]);
  const invoicedIds = useMemo(() => invoicedQuoteIds(invoices), [invoices]);
  const nextInvNum = useMemo(() => nextInvoiceNumber(invoices), [invoices]);
  const clientTotals = useCallback(
    (clientId: string) => computeClientTotals(clientId, quotes, invoices),
    [quotes, invoices]);

  const value: WorkspaceContextValue = {
    clients, quotes, invoices, activeQuoteId,
    getClient, clientName, createClient, updateClient, deleteClient,
    getQuote, createQuote, updateQuote, deleteQuote, addToQuote, setActiveQuoteId,
    getInvoice, createInvoice, updateInvoice, markInvoicePaid, convertQuoteToInvoice,
    dashboardStats, recentActivity, invoicedIds, nextInvoiceNumber: nextInvNum, clientTotals,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}
