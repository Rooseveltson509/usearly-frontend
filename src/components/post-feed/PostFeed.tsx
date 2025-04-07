import React from "react";
import PostList from "../posts/postList/PostList";
import { Post, Reaction } from "@src/types/types";

interface PostFeedProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>; // ✅ Ajout de setPosts
  loading: boolean;
  error: string | null;
  onReactionUpdate: (postId: string, reactions: Reaction[]) => void;
}

const PostFeed: React.FC<PostFeedProps> = ({
  posts,
  setPosts, // ✅ Ajout de setPosts ici
  loading,
  error,
  onReactionUpdate,
}) => {
  return (
    <>
      {loading && <p className="loading-message">Chargement des posts...</p>}
      {error && <p className="error-message">{error}</p>}
      {posts.length > 0 ? (
        posts.map(post => (
          <PostList
            key={post.id}
            post={post}
            setPosts={setPosts} // ✅ Transmet bien setPosts à PostList
            onReactionUpdate={onReactionUpdate}
          />
        ))
      ) : (
        <p>Aucun post disponible.</p>
      )}
    </>
  );
};

export default PostFeed;
