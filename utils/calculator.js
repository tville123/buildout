export function toShoppingList(gallonsRaw) {
  const gallons = Math.floor(gallonsRaw);
  let quarts = Math.ceil((gallonsRaw - gallons) * 4);
  if (quarts >= 4) return { gallons: gallons + 1, quarts: 0 };
  return { gallons, quarts };
}

export function descBuy(buy) {
  const parts = [];
  if (buy.gallons > 0) parts.push(`${buy.gallons} gal`);
  if (buy.quarts > 0) parts.push(`${buy.quarts} qt`);
  return parts.join(' + ') || '< 1 qt';
}
