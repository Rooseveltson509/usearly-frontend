import React, { useEffect, useState } from "react";
import "./PostList.scss";
import defaultAvatar from "../../../assets/images/user.png";
import { Post, Reaction } from "@src/types/types";
import { formatRelativeTime } from "@src/utils/formatRelativeTime";
import postIcon from "../../../assets/images/signalIcon.svg";
import "react-confirm-alert/src/react-confirm-alert.css"; // 📌 Style par défaut
import ReactionSection from "@src/components/reactions/reaction-section/ReactionSection";
import CommentSection from "@src/components/comment-section/CommentSection";
import { deletePost } from "@src/services/apiService";
import Swal from "sweetalert2";

interface PostProps {
  post: Post;
  onReactionUpdate?: (postId: string, reactions: Reaction[]) => void; // 🔥 Ajout de la prop
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>; // ✅ Ajout de setPosts
}

const PostList: React.FC<PostProps> = ({
  post,
  onReactionUpdate,
  setPosts,
}) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [expandedPost, setExpandedPost] = useState<{
    [key: string]: boolean;
  }>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleExpand = (postId: string) => {
    setExpandedPost((prev) => ({
      ...prev,
      [postId]: !prev[postId], // ✅ Clé en `string`
    }));
  };

  // ✅ Fonction pour fermer le menu quand on clique ailleurs
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (!event.target) return;

    const menuElements = document.querySelectorAll(".menu-list");
    let isClickInside = false;

    menuElements.forEach((menu) => {
      if (menu.contains(event.target as Node)) {
        isClickInside = true;
      }
    });

    if (!isClickInside) {
      setIsMenuOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  const handleDeleteComment = async () => {
    const result = await Swal.fire({
      title: "Supprimer le post ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });
    if (!result.isConfirmed) return;

    try {
      const response = await deletePost(post.id);
      if (response.success) {
        setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id)); // ✅ Supprime localement
        Swal.fire("Supprimé !", "Le post a été supprimé.", "success");
      } else {
        Swal.fire(
          "Erreur",
          response.error || "Une erreur s'est produite.",
          "error"
        );
      }
    } catch (error) {
      console.error("❌ Erreur lors de la suppression du post :", error);
      Swal.fire("Erreur", "Une erreur inattendue s'est produite.", "error");
    }
  };

  if (post.isLoading) {
    return (
      <div className="post-card fade-in loading-placeholder">
        {/* FAKE HEADER */}
        <div className="post-header">
          <div className="user-info">
            <div className="avatar-placeholder"></div>
            <p className="loading-text">Chargement...</p>
          </div>
        </div>

        {/* FAKE CONTENU */}
        <div className="post-content">
          <div className="loading-placeholder title"></div>
          <div className="loading-placeholder description"></div>
        </div>

        {/* FAKE FOOTER */}
        <div className="post-footer">
          <div className="loading-placeholder button"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`report-card fade-in`}>
      {/* HEADER */}
      <div className="report-header">
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
          <p>{post.author?.pseudo}</p>
          <span className="report-author">
            C’est moi ou <strong>{post.title}</strong> ?
          </span>
          <span className="report-time">
            • {formatRelativeTime(post.createdAt)}
          </span>
        </div>

        <div className="report-options" onClick={toggleMenu}>
          ⋮
          {isMenuOpen && (
            <ul className="menu-list">
              <li onClick={handleDeleteComment}>🗑 Supprimer</li>
            </ul>
          )}
        </div>
      </div>

      <div className="report-content">
        <div className="post-icon">
          <img src={postIcon} alt="icon post" />
        </div>
        <div className="post-details">
          <h3>
            {post.title}
            <strong className="report-title"> {post.brand?.name} </strong>?
          </h3>
          <p className="report-desc">
            {expandedPost[post.id] ? (
              <>
                {post.content}{" "}
                <span
                  className="see-more"
                  onClick={() => toggleExpand(post.id)} // ✅ Masquer le texte quand cliqué
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  Voir moins
                </span>
              </>
            ) : (
              <>
                {post.content.length > 150
                  ? `${post.content.substring(0, 150)}... `
                  : post.content}
                {post.content.length > 150 && (
                  <span
                    className="see-more"
                    onClick={() => toggleExpand(post.id)} // ✅ Afficher plus quand cliqué
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    Voir plus
                  </span>
                )}
              </>
            )}
          </p>
        </div>
        <div className="img-round">
          {post.brand?.avatar && (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/${post.brand.avatar}`}
              alt="Brand Logo"
              className="brand-logo"
            />
          )}
        </div>
      </div>
      <ReactionSection
        parentId={post.id}
        type="post"
        showCommentInput={showCommentInput}
        setShowCommentInput={setShowCommentInput}
        commentCount={commentCount}
        onReactionUpdate={onReactionUpdate}
      />
      {showCommentInput && (
        <CommentSection
          parentId={post.id}
          type="post"
          showCommentInput={showCommentInput}
          commentCount={commentCount}
          setCommentCount={setCommentCount}
        />
      )}
    </div>
  );
};

export default PostList;
