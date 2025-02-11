import React from "react";
import "./PostList.scss";
import defaultAvatar from "../../../assets/images/user.png";
import { Post } from "@src/types/types";
import { formatRelativeTime } from "@src/utils/formatRelativeTime";

interface PostProps {
  post: Post;
}

const PostList: React.FC<PostProps> = ({ post }) => {
  console.log("Le post :", post); // 🔥 Vérifier la structure des données reçues

  return (
    <div className="post-card">
      {/* HEADER */}
      <div className="post-header">
        <div className="user-info">
          <img
            src={
              post.author?.avatar
                ? `${import.meta.env.VITE_API_BASE_URL}/${post.author.avatar}`
                : defaultAvatar
            }
            alt="Avatar"
            className="user-avatar"
          />
          <span className="post-author">
            C’est moi ou <strong>{post.title}</strong> ?
          </span>
          <span className="post-time">• {formatRelativeTime(post.createdAt)}</span>
        </div>
        <div className="post-options">⋮</div>
      </div>

      {/* CONTENU DU POST */}
      <div className="post-content">
        <div className="post-icon">⚠️</div>
        <div className="post-details">
          <h3 className="post-title">{post.title} 🔥</h3>
          <p className="post-description">{post.content}</p>
        </div>
        {post.brand?.avatar && ( // ✅ Vérification que brand existe bien avant d'afficher l'avatar
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/${post.brand.avatar}`}
            alt="Brand Logo"
            className="brand-logo"
          />
        )}
      </div>

      {/* FOOTER */}
      <div className="post-footer">
        <div className="reaction">
          <span className="emoji">😠</span> <span>Early signalement</span>
        </div>
        <div className="icons">
          <span className="icon">💡 0</span>
          <span className="icon">💬 {0}</span>
          {/* <span className="icon">💬 {post.comments?.length || 0}</span> */}
        </div>
      </div>
    </div>
  );
};

export default PostList;
