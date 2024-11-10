export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const publishDate = new Date(date);
  const diff = (now.getTime() - publishDate.getTime()) / 1000;

  const times = [
    { unit: 'year', value: 31536000 },
    { unit: 'month', value: 2592000 },
    { unit: 'week', value: 604800 },
    { unit: 'day', value: 86400 },
    { unit: 'hour', value: 3600 },
    { unit: 'minute', value: 60 },
    { unit: 'second', value: 1 }
  ];

  if (diff >= 604800) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(publishDate);
  }

  for (const { unit, value } of times) {
    const timePassed = Math.floor(diff / value);
    if (timePassed >= 1) return `${timePassed} ${unit}${timePassed > 1 ? 's' : ''} ago`;
  }

  return 'just now';
}