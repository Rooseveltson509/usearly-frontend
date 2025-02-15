import React, { useState } from "react";
import { toggleLikePost } from "@src/services/apiService";
import { Post } from "@src/types/types";

interface PostProps {
  post: Post;
}

const LikeCount: React.FC<PostProps> = ({ post }) => {
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [userLiked, setUserLiked] = useState(false);

  // ✅ Gérer le like
  const handleLike = async () => {
    try {
      const response = await toggleLikePost(post.id);

      if (response.success) {
        setLikeCount(response.likeCount); // 🔥 On met à jour avec la valeur exacte depuis l’API
        setUserLiked(response.userLiked); // 🔥 On suit l’état retourné par l’API
      }
    } catch (error) {
      console.error("Erreur lors du like :", error);
    }
  };

  return (
    <div className="post-card fade-in">
      <button className="like-button">👍 J’aime</button>

      {/* FOOTER */}
      <div className="post-footer">
        {/* ✅ Icônes d'interaction */}
        <div className="icons">
          <span className="icon" onClick={handleLike}>
            {userLiked ? "👍" : "👍"} {likeCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LikeCount;
