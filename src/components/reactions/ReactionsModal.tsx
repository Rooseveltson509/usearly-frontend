import React, { useEffect, useState } from "react";
import "./ReactionsModal.scss";
import { fetchReactionUsers } from "@src/services/apiService";
import { motion, AnimatePresence } from "framer-motion";
interface ReactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

const ReactionsModal: React.FC<ReactionModalProps> = ({ isOpen, onClose, postId }) => {
  const [reactionUsers, setReactionUsers] = useState<
    Record<string, { id: string; pseudo: string; avatar: string }[]>
  >({});
  const [selectedEmoji, setSelectedEmoji] = useState<string>("all");

  // ✅ Charger les utilisateurs dès que le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      const fetchAllReactions = async () => {
        try {
          const emojisToFetch = ["👍", "❤️", "😂", "😮", "😡", "🤬", "🥵"]; // Ajoute tes emojis ici
          const usersByReaction: Record<string, { id: string; pseudo: string; avatar: string }[]> =
            {};
          for (const emoji of emojisToFetch) {
            const response = await fetchReactionUsers(postId, emoji);
            usersByReaction[emoji] =
              response.users.map(user => ({
                id: user.id,
                pseudo: user.pseudo,
                avatar: user.avatar ?? "", // ✅ Assure que `avatar` est une string
              })) || [];
          }

          console.log("📢 Utilisateurs par réaction :", usersByReaction);
          setReactionUsers(usersByReaction);
        } catch (error) {
          console.error("❌ Erreur lors de la récupération des utilisateurs :", error);
        }
      };

      fetchAllReactions();
    }
  }, [isOpen, postId]);

  const getFilteredUsers = () => {
    if (selectedEmoji === "all") {
      return Object.values(reactionUsers)
        .flat()
        .map(user => ({
          ...user,
          avatar: user.avatar
            ? `${import.meta.env.VITE_API_BASE_URL}/${user.avatar}`
            : "/images/defaultAvatar.png",
        }));
    }
    return (reactionUsers[selectedEmoji] || []).map(user => ({
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

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
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

            {/* Onglets de réaction */}
            <div className="reaction-tabs">
              <button
                className={selectedEmoji === "all" ? "active" : ""}
                onClick={() => setSelectedEmoji("all")}
              >
                Tous {Object.values(reactionUsers).flat().length}
              </button>
              {Object.keys(reactionUsers)
                .filter(emoji => reactionUsers[emoji]?.length > 0)
                .map(emoji => (
                  <button
                    key={emoji}
                    className={selectedEmoji === emoji ? "active" : ""}
                    onClick={() => setSelectedEmoji(emoji)}
                  >
                    {emoji} {reactionUsers[emoji]?.length}
                  </button>
                ))}
            </div>

            {/* ✅ Animation du changement de contenu */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedEmoji} // Chaque changement d'emoji déclenche l'animation
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={tabVariants}
                className="user-list"
              >
                {getFilteredUsers().length > 0 ? (
                  getFilteredUsers().map(user => (
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

export default ReactionsModal;
