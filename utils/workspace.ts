import type { Quote, Invoice, Client, LineItem, InvoiceView } from '../types';
import { uuid } from './uuid';

// ─── Money math (single source of truth for quote/invoice totals) ───
export function lineItemsSubtotal(items: LineItem[]): number {
  return items.reduce((sum, i) => sum + (i.quantity || 0) * (i.unitPrice || 0), 0);
}

export function quoteTotals(quote: Pick<Quote, 'lineItems' | 'taxRate'>): {
  subtotal: number; tax: number; total: number;
} {
  const subtotal = lineItemsSubtotal(quote.lineItems);
  const tax = subtotal * ((quote.taxRate || 0) / 100);
  return { subtotal, tax, total: subtotal + tax };
}

export function invoiceTotals(invoice: Pick<Invoice, 'lineItems' | 'taxRate'>): {
  subtotal: number; tax: number; total: number;
} {
  const subtotal = lineItemsSubtotal(invoice.lineItems);
  const tax = subtotal * ((invoice.taxRate || 0) / 100);
  return { subtotal, tax, total: subtotal + tax };
}

// Derived display status: a pending invoice past its due date reads as 'overdue'.
export function invoiceView(invoice: Invoice): InvoiceView {
  if (invoice.status === 'paid') return 'paid';
  return new Date(invoice.dueAt).getTime() < Date.now() ? 'overdue' : 'pending';
}

// ─── Cross-entity sets / counters ───
export function invoicedQuoteIds(invoices: Invoice[]): Set<string> {
  return new Set(invoices.map(i => i.quoteId).filter((id): id is string => !!id));
}

export function nextInvoiceNumber(invoices: Invoice[]): number {
  return invoices.reduce((max, i) => Math.max(max, i.number), 2000) + 1;
}

export function nextQuoteNumber(quotes: Quote[]): number {
  return quotes.reduce((max, q) => Math.max(max, q.number), 1000) + 1;
}

// ─── Dashboard rollups ───
export interface DashboardStats {
  outstanding: number;
  overdueCount: number; overdueAmount: number;
  pendingCount: number; pendingAmount: number;
  readyCount: number; readyAmount: number;
}

export function computeDashboardStats(quotes: Quote[], invoices: Invoice[]): DashboardStats {
  const overdue = invoices.filter(i => invoiceView(i) === 'overdue');
  const pending = invoices.filter(i => invoiceView(i) === 'pending');
  const billed = invoicedQuoteIds(invoices);
  const ready = quotes.filter(q => q.status === 'approved' && !billed.has(q.id));
  const sumAmt = (arr: Invoice[]) => arr.reduce((s, i) => s + i.amount, 0);
  return {
    outstanding: sumAmt(overdue) + sumAmt(pending),
    overdueCount: overdue.length,
    overdueAmount: sumAmt(overdue),
    pendingCount: pending.length,
    pendingAmount: sumAmt(pending),
    readyCount: ready.length,
    readyAmount: ready.reduce((s, q) => s + q.total, 0),
  };
}

// ─── Merged recent-activity feed (quotes ∪ invoices), newest first ───
export interface ActivityItem {
  kind: 'quote' | 'invoice';
  id: string;
  clientId: string | null;
  job: string;
  amount: number;
  status: string;
  ts: string;
}

export function computeRecentActivity(quotes: Quote[], invoices: Invoice[], limit = 4): ActivityItem[] {
  const qa: ActivityItem[] = quotes.map(q => ({
    kind: 'quote', id: q.id, clientId: q.clientId, job: q.job, amount: q.total, status: q.status, ts: q.createdAt,
  }));
  const ia: ActivityItem[] = invoices.map(i => ({
    kind: 'invoice', id: i.id, clientId: i.clientId, job: i.job, amount: i.amount,
    status: invoiceView(i), ts: i.paidAt || i.createdAt,
  }));
  return [...qa, ...ia]
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    .slice(0, limit);
}

// ─── Per-client rollups for the detail screen ───
export interface ClientTotals {
  quoted: number; invoiced: number; paid: number;
  quotes: Quote[]; invoices: Invoice[]; jobCount: number;
}

export function computeClientTotals(clientId: string, quotes: Quote[], invoices: Invoice[]): ClientTotals {
  const cq = quotes.filter(q => q.clientId === clientId);
  const ci = invoices.filter(i => i.clientId === clientId);
  return {
    quoted: cq.reduce((s, q) => s + q.total, 0),
    invoiced: ci.reduce((s, i) => s + i.amount, 0),
    paid: ci.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
    quotes: cq,
    invoices: ci,
    jobCount: cq.length,
  };
}

// Two-letter avatar initials from a display name.
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Migration from the legacy quote shape ───
// Legacy quote: { id, clientName, jobDescription, lineItems, taxRate, status: 'draft'|'sent', createdAt, updatedAt }
interface LegacyQuote {
  id: string;
  clientName?: string;
  jobDescription?: string;
  lineItems?: LineItem[];
  taxRate?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function needsMigration(raw: unknown[]): boolean {
  return raw.some(q => q != null && typeof q === 'object' && !('number' in (q as object)));
}

// Migrate legacy quotes → { quotes, clients }. One Client is derived per distinct
// non-empty clientName; quote numbers are assigned sequentially by createdAt.
export function migrateQuotes(raw: unknown[]): { quotes: Quote[]; clients: Client[] } {
  const ordered = [...(raw as LegacyQuote[])].sort((a, b) =>
    new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());

  const clientsByName = new Map<string, Client>();
  let num = 1001;

  const quotes: Quote[] = ordered.map(old => {
    const name = (old.clientName || '').trim();
    let clientId: string | null = null;
    if (name) {
      let client = clientsByName.get(name.toLowerCase());
      if (!client) {
        client = { id: uuid(), name, phone: '', email: '', initials: initials(name) };
        clientsByName.set(name.toLowerCase(), client);
      }
      clientId = client.id;
    }
    const lineItems = old.lineItems || [];
    const taxRate = old.taxRate ?? 8.25;
    const { total } = quoteTotals({ lineItems, taxRate });
    const now = new Date().toISOString();
    return {
      id: old.id,
      number: num++,
      clientId,
      job: old.jobDescription || '',
      lineItems,
      taxRate,
      total,
      status: old.status === 'sent' ? 'sent' : 'draft',
      createdAt: old.createdAt || now,
      updatedAt: old.updatedAt || now,
    };
  });

  // Keep most-recent-first ordering to match how the app prepends new quotes.
  quotes.reverse();
  return { quotes, clients: Array.from(clientsByName.values()) };
}
