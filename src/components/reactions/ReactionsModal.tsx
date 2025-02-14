import React, { useEffect, useState } from "react";
import "./ReactionsModal.scss";
import { fetchReactionUsers } from "@src/services/apiService";

interface ReactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

const ReactionsModal: React.FC<ReactionModalProps> = ({
  isOpen,
  onClose,
  postId,
}) => {
  const [reactionUsers, setReactionUsers] = useState<
    Record<string, { id: string; pseudo: string; avatar: string }[]>
  >({});
  const [selectedEmoji, setSelectedEmoji] = useState<string>("all");

  // ✅ Charger les utilisateurs dès que le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      const fetchAllReactions = async () => {
        try {
          const emojisToFetch = ["👍", "❤️", "😂", "😮", "😡"]; // Ajoute tes emojis ici
          const usersByReaction: Record<
            string,
            { id: string; pseudo: string; avatar: string }[]
          > = {};
          for (const emoji of emojisToFetch) {
            const response = await fetchReactionUsers(postId, emoji);
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
  }, [isOpen, postId]);

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

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Réactions</h2>
        <div className="reaction-tabs">
          <button
            className={selectedEmoji === "all" ? "active" : ""}
            onClick={() => setSelectedEmoji("all")}
          >
            Tous {Object.values(reactionUsers).flat().length}
          </button>
          {Object.keys(reactionUsers)
            .filter((emoji) => reactionUsers[emoji]?.length > 0) // ✅ Cache les réactions vides
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
        <div className="user-list">
          {getFilteredUsers().length > 0 ? (
            getFilteredUsers().map((user) => (
              <div key={user.id} className="user-item">
                <img
                  src={`${user.avatar}`}
                  alt={user.pseudo}
                />
                <span>{user.pseudo}</span>
              </div>
            ))
          ) : (
            <p>Aucun utilisateur pour cette réaction.</p>
          )}
        </div>
        <button onClick={onClose} className="close-button">
          Fermer
        </button>
      </div>
    </div>
  ) : null;
};

export default ReactionsModal;
