export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  source?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  initials: string;
}

export type QuoteStatus = 'draft' | 'sent' | 'approved';

export interface Quote {
  id: string;
  number: number;
  clientId: string | null;     // null = unassigned draft (e.g. created from a calculator)
  job: string;
  lineItems: LineItem[];
  taxRate: number;
  total: number;               // stored snapshot = subtotal + tax
  status: QuoteStatus;
  updatedAt: string;
  createdAt: string;
}

// Stored status is only pending | paid; 'overdue' is DERIVED (pending && dueAt < now).
export type InvoiceStatus = 'pending' | 'paid';
export type InvoiceView = 'overdue' | 'pending' | 'paid';
export type PaymentTerm = 7 | 15 | 30;

export interface Invoice {
  id: string;
  number: number;
  clientId: string | null;
  quoteId?: string;            // set when billed from a quote
  job: string;
  amount: number;
  lineItems: LineItem[];
  taxRate: number;
  status: InvoiceStatus;
  dueAt: string;
  paidAt?: string;
  createdAt: string;
}

export type ToolName = 'Paint' | 'Tile' | 'Grout' | 'LVP' | 'Carpet' | 'Stairs' | 'Drywall';

export interface Wall {
  id: number;
  widthText: string;
  heightText: string;
  width: number;
  height: number;
  hasDoor: boolean;
  doorW: string;
  doorH: string;
  hasWindow: boolean;
  windowW: string;
  windowH: string;
}

export interface ShoppingListBuy {
  gallons: number;
  quarts: number;
}

export interface PaintResult {
  totalGallons: number;
  totalArea: number;
  coats: number;
  wallBuy: ShoppingListBuy;
  ceilBuy: ShoppingListBuy | null;
  wallArea: number;
  ceilingArea: number;
  totalCost: number | null;
  summaryRows: Array<{ name: string; sqft: number }> | null;
  proTip: string;
}
