/**
 * Formats a date into a human-readable relative time string.
 *
 * Rules:
 *  - < 1 min            → "just now"
 *  - 1 – 59 min         → "N min ago"
 *  - 1 – 23 hours       → "N hour ago" / "N hours ago"
 *  - 1 – 29 days        → "N day ago"  / "N days ago"
 *  - 1 – 11 months      → "N month ago" / "N months ago"
 *  - 12+ months         → "N year ago"  / "N years ago"
 *
 * Historical match cards in the comparison module intentionally use
 * toLocaleDateString() directly so they always show an absolute date.
 */
export function formatRelativeTime(dateString: string | Date): string {
  if (!dateString) return "";

  const now  = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();

  // Invalid or future date
  if (isNaN(diffMs) || diffMs < 0) return "just now";

  const diffMins   = Math.floor(diffMs / (1000 * 60));
  const diffHours  = Math.floor(diffMins  / 60);
  const diffDays   = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays  / 30.4375); // average days per month
  const diffYears  = Math.floor(diffDays  / 365.25);

  if (diffMins === 0)   return "just now";
  if (diffMins < 60)    return `${diffMins} min ago`;
  if (diffHours < 24)   return diffHours === 1 ? "1 hour ago"  : `${diffHours} hours ago`;
  if (diffDays < 30)    return diffDays   === 1 ? "1 day ago"   : `${diffDays} days ago`;
  if (diffMonths < 12)  return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
  return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
}
