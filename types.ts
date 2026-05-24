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
