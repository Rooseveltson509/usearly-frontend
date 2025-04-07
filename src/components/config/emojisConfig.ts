export const EMOJIS = {
  post: [
    { emoji: "😒", label: "Agacé" },
    { emoji: "😖", label: "Frustré" },
    { emoji: "😐", label: "Neutre" },
    { emoji: "😨", label: "Angoissé" },
    { emoji: "😞", label: "Déçu" },
    { emoji: "🤣", label: "Haha" },
    { emoji: "🥵", label: "Fatiguant" },
  ],

  report: [
    { emoji: "🙋🏻‍♂️", label: "Moi aussi" },
    { emoji: "🙏🏻", label: "Merci pour l'alerte" },
    { emoji: "🤯", label: "Choqué" },
    { emoji: "😂", label: "MDR" },
    { emoji: "😱", label: "Inquiétant" },
    { emoji: "🚀", label: "À corriger vite" },
  ],
  coupdecoeur: [
    { emoji: "😂", label: "Trop marrant" },
    { emoji: "🔥", label: "Stylé" },
    { emoji: "🧐", label: "Belle découverte" },
    { emoji: "👑", label: "Iconique" },
    { emoji: "😍", label: "Trop cute" },
  ],
  suggestion: [
    { emoji: "👍", label: "Oui j'aime" },
    { emoji: "🎗", label: "Je soutiens" },
    { emoji: "😍", label: "Jen rêve" },
    { emoji: "🤔", label: "Je ne sais pas trop" },
    { emoji: "👎", label: "Pas convaincu" },
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
