export function capitalizeWords(value) {
  if (typeof value !== 'string' || !value.trim()) return value || '';

  return value
    .trim()
    .split(' ')
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
