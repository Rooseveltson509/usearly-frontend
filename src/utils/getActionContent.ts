import handsUp from "../assets/card/handsup.svg";
import congratulation from "../assets/images/congratulation.svg";
import shakeHand from "../assets/images/shakeHand.svg";

// 📌 Définition du type accepté
export type ReactionType = "post" | "report" | "coupdecoeur" | "suggestion";

// 📌 Fonction pour retourner l'image et le texte associés à chaque type
export const getActionContent = (type: ReactionType) => {
  switch (type) {
    case "post":
      return { image: handsUp, text: "Me too" };
    case "report":
      return { image: handsUp, text: "Me too" };
    case "coupdecoeur":
      return { image: congratulation, text: "Complimenter" };
    case "suggestion":
      return { image: shakeHand, text: "Soutenir l'idée" };
    default:
      return { image: handsUp, text: "Me too" };
  }
};
