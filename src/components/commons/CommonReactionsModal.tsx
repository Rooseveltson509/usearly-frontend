import React, { useEffect, useState } from "react";
import "./CommonReactionsModal.scss";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchCdcReactionUsers,
  fetchReportReactionUsers,
  fetchSuggestionReactionUsers,
} from "@src/services/apiReactions";
import { getEmojisForType } from "../config/emojisConfig";
import { fetchReactionUsers } from "@src/services/apiService";

interface ReactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: string;
  type: "post" | "report" | "suggestion" | "coupdecoeur";
}

const CommonReactionsModal: React.FC<ReactionModalProps> = ({
  isOpen,
  onClose,
  parentId,
  type,
}) => {
  const [reactionUsers, setReactionUsers] = useState<
    Record<string, { id: string; pseudo: string; avatar: string }[]>
  >({});
  const [selectedEmoji, setSelectedEmoji] = useState<string>("all");
  //const [isModalOpen, setIsModalOpen] = useState(false);

  // Sélectionne l'API correcte en fonction du type
  const fetchUsersByReaction =
    type === "report"
      ? fetchReportReactionUsers
      : type === "post"
      ? fetchReactionUsers
      : type === "suggestion"
      ? fetchSuggestionReactionUsers
      : fetchCdcReactionUsers;

  // ✅ Charger les utilisateurs dès que le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      const fetchAllReactions = async () => {
        try {
          const emojisToFetch = getEmojisForType(type); // ✅ Détermine les émojis selon le type
          const usersByReaction: Record<
            string,
            { id: string; pseudo: string; avatar: string }[]
          > = {};

          for (const { emoji } of emojisToFetch) {
            // 🔥 Extraction uniquement de l'emoji
            const response = await fetchUsersByReaction(parentId, emoji);
            usersByReaction[emoji] =
              response.users.map((user) => ({
                id: user.id,
                pseudo: user.pseudo,
                avatar: user.avatar ?? "", // ✅ Assure que `avatar` est une string
              })) || [];
          }

          console.log("📢 Utilisateurs par réaction :", usersByReaction);
          setReactionUsers(usersByReaction);
        } catch (error) {
          console.error(
            "❌ Erreur lors de la récupération des utilisateurs :",
            error
          );
        }
      };

      fetchAllReactions();
    }
  }, [fetchUsersByReaction, isOpen, parentId, type]); // ✅ Ajout du type dans les dépendances

  const getFilteredUsers = () => {
    if (selectedEmoji === "all") {
      return Object.values(reactionUsers)
        .flat()
        .map((user) => ({
          ...user,
          avatar: user.avatar
            ? `${import.meta.env.VITE_API_BASE_URL}/${user.avatar}`
            : "/images/defaultAvatar.png",
        }));
    }
    return (reactionUsers[selectedEmoji] || []).map((user) => ({
      ...user,
      avatar: user.avatar
        ? `${import.meta.env.VITE_API_BASE_URL}/${user.avatar}`
        : "/images/defaultAvatar.png",
    }));
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <motion.div className="modal-content" variants={modalVariants}>
            <h2>Réactions</h2>

            <div className="reaction-tabs">
              <button
                className={selectedEmoji === "all" ? "active" : ""}
                onClick={() => setSelectedEmoji("all")}
              >
                Tous {Object.values(reactionUsers).flat().length}
              </button>
              {Object.keys(reactionUsers)
                .filter((emoji) => reactionUsers[emoji]?.length > 0)
                .map((emoji) => (
                  <button
                    key={emoji}
                    className={selectedEmoji === emoji ? "active" : ""}
                    onClick={() => setSelectedEmoji(emoji)}
                  >
                    {emoji} {reactionUsers[emoji]?.length}
                  </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedEmoji}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="user-list"
              >
                {getFilteredUsers().length > 0 ? (
                  getFilteredUsers().map((user) => (
                    <motion.div
                      key={user.id}
                      className="user-item"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img src={`${user.avatar}`} alt={user.pseudo} />
                      <span>{user.pseudo}</span>
                    </motion.div>
                  ))
                ) : (
                  <p>Aucun utilisateur pour cette réaction.</p>
                )}
              </motion.div>
            </AnimatePresence>

            <button onClick={onClose} className="close-button">
              Fermer
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommonReactionsModal;
