export const C = {
  bg: '#0f0f0f',
  surface: '#1a1a1a',
  border: '#2e2e2e',
  text: '#f0ede8',
  textDim: '#555',
  textMid: '#888',
  yellow: '#f5c842',
  red: '#e05c3a',
} as const;

// Status colors for quote + invoice badges, amounts, and bucket dots.
export const STATUS_META: Record<string, { label: string; color: string }> = {
  draft:    { label: 'Draft',    color: '#888888' },
  sent:     { label: 'Sent',     color: '#f5c842' },
  approved: { label: 'Approved', color: '#4caf7d' },
  overdue:  { label: 'Overdue',  color: '#e05c3a' },
  pending:  { label: 'Pending',  color: '#f5a623' },
  paid:     { label: 'Paid',     color: '#4caf7d' },
};

export const WALL_NAMES: readonly string[] = [
  'North Wall', 'South Wall', 'East Wall', 'West Wall',
  'Wall 5', 'Wall 6', 'Wall 7', 'Wall 8', 'Wall 9', 'Wall 10',
];
