export function formatMoney(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Whole-dollar money ($1,840) for list rows + stat cards.
export function money0(n: number): string {
  return '$' + Math.round(Number(n || 0)).toLocaleString('en-US');
}

// Split a number into { whole, cents } for the big yellow hero / total strips.
export function splitMoney(n: number): { whole: string; cents: string } {
  const v = Number(n || 0);
  const whole = Math.floor(v);
  const cents = Math.round((v - whole) * 100);
  return { whole: '$' + whole.toLocaleString('en-US'), cents: String(cents).padStart(2, '0') };
}

const DAY = 86400000;

// Relative date label ("Today", "Yesterday", "2 days ago", "Mar 4") from an ISO string.
export function relDate(iso: string): string {
  const ts = new Date(iso).getTime();
  const d = Math.round((Date.now() - ts) / DAY);
  if (d <= 0) return 'Today';
  if (d === 1) return 'Yesterday';
  if (d < 7) return d + ' days ago';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Positive whole days an invoice is past its due date (0 if not yet due).
export function daysOverdue(dueAt: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(dueAt).getTime()) / DAY));
}

// Whole days until due (negative once overdue).
export function daysUntilDue(dueAt: string): number {
  return Math.round((new Date(dueAt).getTime() - Date.now()) / DAY);
}

// Absolute date label ("May 30, 2026") for due dates / paid dates.
export function dueDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
