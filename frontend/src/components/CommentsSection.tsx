import { useEffect, useState } from "react";
import api from "../api/axios";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface CommentsSectionProps {
  postId: number;
  onCommentsCountChange?: (delta: number) => void; 
}

export default function CommentsSection({
  postId,
  onCommentsCountChange,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/comment/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      console.error("Greška pri dohvatanju komentara", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post(
        `/comment/${postId}`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments((prev) => [res.data, ...prev]);
      setNewComment("");

      
      if (onCommentsCountChange) {
        onCommentsCountChange(1);
      }
    } catch (err) {
      console.error("Greška pri dodavanju komentara", err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments((prev) => prev.filter((c) => c.id !== commentId));

      
      if (onCommentsCountChange) {
        onCommentsCountChange(-1);
      }
    } catch (err) {
      console.error("Greška pri brisanju komentara", err);
    }
  };

  return (
    <div className="mt-4 border-t border-gray-700 pt-3">
      <form onSubmit={handleAddComment} className="flex space-x-2 mb-3">
        <input
          type="text"
          placeholder="Napiši komentar..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700 text-white text-sm focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
        >
          Pošalji
        </button>
      </form>

      {loading ? (
        <p className="text-gray-400 text-sm">Učitavanje komentara...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-sm">Nema komentara još.</p>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start justify-between bg-gray-800 p-2 rounded"
            >
              <div>
                <p className="text-sm text-gray-200">{comment.content}</p>
                <p className="text-xs text-gray-500">
                  {comment.user?.name || "Nepoznat"} •{" "}
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Obriši
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}