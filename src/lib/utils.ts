/**
 * Formats a date string into "X hour ago" or "Y min ago" format.
 * If the date is invalid, in the future, or less than a minute ago, it defaults to "just now".
 */
export function formatRelativeTime(dateString: string | Date): string {
  if (!dateString) return "";
  
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  
  // If parsing failed or the date is in the future
  if (isNaN(diffMs) || diffMs < 0) {
    return "just now";
  }
  
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  // Under a minute
  if (diffMins === 0) {
    return "just now";
  }
  
  const diffHours = Math.floor(diffMins / 60);
  
  // Under an hour
  if (diffHours === 0) {
    return `${diffMins} min ago`;
  }
  
  // 1 hour or more (otherwise use hour ago)
  return `${diffHours} hour ago`;
}
