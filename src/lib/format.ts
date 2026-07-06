export function formatBlogDate(date: string | Date) {
  const value = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat('fa-IR', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    hour: 'numeric',
  }).format(value)
}
