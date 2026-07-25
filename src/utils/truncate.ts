/**
 * Truncate a string to maxLength characters with ellipsis.
 * Returns the full string if length <= maxLength.
 */
export function truncatePreview(content: string, maxLength: number = 120): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + '…';
}
