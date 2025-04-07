export const formatRelativeTime = (dateString: string): string => {
  const parsedDate = new Date(dateString);
  const now = new Date();

  if (isNaN(parsedDate.getTime())) return "";

  const diffInSeconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}min`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}j`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mois`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}an${diffInYears > 1 ? "s" : ""}`;
};
