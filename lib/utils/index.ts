export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'short') {
    return new Intl.DateTimeFormat('en-MY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  }
  
  return new Intl.DateTimeFormat('en-MY', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function formatMonth(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return new Intl.DateTimeFormat('en-MY', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function getBudgetAlertLevel(percentage: number): 'safe' | 'warning' | 'danger' | 'over' {
  if (percentage >= 100) return 'over';
  if (percentage >= 90) return 'danger';
  if (percentage >= 80) return 'warning';
  return 'safe';
}

export function parseObjectId(id: string | { toString(): string } | null | undefined): string {
  if (!id) return '';
  return typeof id === 'string' ? id : id.toString();
}

export function getMonthStart(month: string): Date {
  const [year, monthNum] = month.split('-');
  return new Date(parseInt(year), parseInt(monthNum) - 1, 1);
}

export function getMonthEnd(month: string): Date {
  const [year, monthNum] = month.split('-');
  return new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);
}

export function getCurrentMonthRange(): { start: Date; end: Date } {
  const month = getCurrentMonth();
  return {
    start: getMonthStart(month),
    end: getMonthEnd(month),
  };
}

export function isCurrentMonth(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const currentMonth = getCurrentMonth();
  const dateMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  return currentMonth === dateMonth;
}

export function getMonthOptions(): Array<{ value: string; label: string }> {
  const options: Array<{ value: string; label: string }> = [];
  const now = new Date();

  // Last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = formatMonth(value);
    options.push({ value, label });
  }

  // Next 3 months
  for (let i = 1; i <= 3; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = formatMonth(value);
    options.push({ value, label });
  }

  return options;
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return formatDate(d, 'short');
}

export function truncate(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function generateRandomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA',
    '#FCBAD3', '#FF8CC6', '#A8E6CF', '#FFD3B6', '#FFAAA5',
    '#C7CEEA', '#B5B5B5'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function isValidMonthFormat(month: string): boolean {
  return /^\d{4}-\d{2}$/.test(month);
}

export function getInitials(name: string): string {
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}