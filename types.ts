export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  source?: string;
}

export interface Quote {
  id: string;
  clientName: string;
  jobDescription: string;
  lineItems: LineItem[];
  taxRate: number;
  status: 'draft' | 'sent';
  updatedAt: string;
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
