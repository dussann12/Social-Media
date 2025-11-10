import { useEffect, useState } from "react";
import api from "../api/axios";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
  };
}

interface CommentsSectionProps {
  postId: number;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 🔹 Učitavanje komentara za post
  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/comment/${postId}`);
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

  // 🔹 Dodavanje komentara
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.post(
        `/comment/${postId}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ odmah dodaj novi komentar lokalno
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Greška pri dodavanju komentara", err);
    }
  };

  // 🔹 Brisanje komentara
  const handleDeleteComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ odmah obriši lokalno
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Greška pri brisanju komentara", err);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-200">
        💬 Komentari
      </h3>

      {/* 🟢 Forma za dodavanje komentara */}
      <form onSubmit={handleAddComment} className="flex mb-4">
        <input
          type="text"
          placeholder="Napiši komentar..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-grow p-2 rounded-l bg-gray-700 text-white focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r"
        >
          Pošalji
        </button>
      </form>

      {/* 🔵 Lista komentara */}
      {loading ? (
        <p className="text-gray-400">Učitavanje komentara...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">Još uvek nema komentara.</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-800 p-3 rounded-lg mb-3 flex justify-between items-center transition-all duration-200 hover:bg-gray-750"
          >
            <div>
              <p className="text-gray-200">{comment.content}</p>
              <p className="text-sm text-gray-500">
                {comment.user?.name || "Nepoznat"} —{" "}
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>

            {/* 🔴 Dugme za brisanje (vidi se samo autoru) */}
            {comment.user?.id === user.id && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-500 hover:text-red-400 text-lg ml-2"
                title="Obriši komentar"
              >
                🗑
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}