type FeedbackType = "report" | "suggestion" | "coupdecoeur";

// Emojis utilisés pour chaque type avec leur label
const emojiLabelMap: Record<FeedbackType, Record<string, string>> = {
  report: {
    "😡": "Énervé",
    "😤": "Exaspéré",
    "😭": "Triste",
    "🤯": "Incompréhensible",
    "🛑": "Bloqué",
    "⚠️": "Problème",
  },
  suggestion: {
    "💡": "Idée",
    "✨": "Amélioration",
    "🪄": "Magique",
    "🧠": "Pertinent",
    "📈": "Boost",
    "🛠️": "Optimisation",
  },
  coupdecoeur: {
    "❤️": "J'adore",
    "🔥": "Incroyable",
    "🥰": "Trop bien",
    "👏": "Bravo",
    "😍": "Top design",
    "👌": "Parfait",
  },
};

// Fonction utilitaire
export const getEmojiLabel = (emoji: string, type: FeedbackType): string => {
  return emojiLabelMap[type]?.[emoji] || "Réaction";
};
