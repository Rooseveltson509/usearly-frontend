export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s`; // Moins de 60s
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `${diffInMinutes}min${diffInMinutes > 1 ? "s" : ""}`; // Moins d'1h
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`; // Moins d'1 jour
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}j`; // Moins d'1 mois
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mois`; // Moins d'1 an
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}an${diffInYears > 1 ? "s" : ""}`; // Plus d'1 an
};
