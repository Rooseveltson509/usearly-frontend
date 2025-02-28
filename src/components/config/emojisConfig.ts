export const EMOJIS = {
  post: [
    { emoji: "👍", label: "J’aime" },
    { emoji: "❤️", label: "J’adore" },
    { emoji: "😂", label: "Haha" },
    { emoji: "😮", label: "Wouah" },
    { emoji: "😡", label: "En colère" },
    { emoji: "🤬", label: "Furieux" },
    { emoji: "🥵", label: "Trop chaud" },
  ],
  
  report: [
    { emoji: "⚠️", label: "Alerte" },
    { emoji: "😨", label: "Inquiétant" },
    { emoji: "👀", label: "À surveiller" },
    { emoji: "❌", label: "Problème" },
    { emoji: "👍", label: "D’accord" },
    { emoji: "😂", label: "Drôle" },
    { emoji: "😡", label: "Inacceptable" },
  ],
  suggestion: [
    { emoji: "💡", label: "Bonne idée" },
    { emoji: "🔥", label: "Excellent" },
    { emoji: "🚀", label: "Innovant" },
    { emoji: "👍", label: "J’approuve" },
    { emoji: "😂", label: "Amusant" },
  ],
  coupdecoeur: [
    { emoji: "💖", label: "Coup de cœur" },
    { emoji: "😍", label: "J’adore" },
    { emoji: "⭐", label: "Super" },
    { emoji: "🎉", label: "Félicitations" },
    { emoji: "👍", label: "J’aime" },
    { emoji: "❤️", label: "Trop bien" },
    { emoji: "😂", label: "Marrant" },
  ],
};

/**
 * Fonction pour récupérer les emojis d'un type spécifique.
 * @param type - "post" | "report" | "suggestion" | "coupdecoeur"
 * @returns Liste des emojis avec labels
 */
export const getEmojisForType = (type: keyof typeof EMOJIS) => {
  return EMOJIS[type] || [];
};
