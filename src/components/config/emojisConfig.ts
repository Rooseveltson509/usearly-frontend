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
    { emoji: "🥵", label: "Epuisé" },
    { emoji: "😒", label: "Agacé" },
    { emoji: "😖", label: "Frustré" },
    { emoji: "😐", label: "Neutre" },
    { emoji: "😨", label: "Angoissé" },
    { emoji: "😞", label: "Déçu" },
    { emoji: "🤣", label: "Haha" },
    { emoji: "😡", label: "En colère" },
  ],
  suggestion: [
    { emoji: "💡", label: "Bonne idée" },
    { emoji: "🤩", label: "J'en rêve !" },
    { emoji: "🚀", label: "Innovant" },
    { emoji: "👍", label: "J’approuve" },
    { emoji: "😂", label: "Amusant" },
    { emoji: "🤔", label: "Mouais" },
    { emoji: "👎", label: "Je n'approuve pas" },
  ],
  coupdecoeur: [
    { emoji: "💖", label: "Coup de cœur" },
    { emoji: "😍", label: "J’adore" },
    { emoji: "🫶", label: "Coeur sur la marque" },
    { emoji: "👏", label: "Bravo" },
    { emoji: "👍", label: "J’aime" },
    { emoji: "😀", label: "Trop bien" },
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
