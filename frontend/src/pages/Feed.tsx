import { useEffect, useState } from "react";
import api from "../api/axios";

interface Post {
  id: number;
  title: string;
  content: string;
  author?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

 
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/posts"); 
      setPosts(res.data);
    } catch (err) {
      console.error("Greška pri učitavanju postova", err);
    } finally {
      setLoading(false);
    }
  };


  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await api.post("/post/create", { title, content });
      setPosts([res.data, ...posts]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Greška pri kreiranju posta", err);
    }
  };

 
  const handleLike = async (postId: number) => {
    try {
      await api.post(`/likes/${postId}`);
      setLikedPosts((prev) =>
        prev.includes(postId)
          ? prev.filter((id) => id !== postId)
          : [...prev, postId]
      );
    } catch (err) {
      console.error("Greška pri lajkovanju", err);
    }
  };

 
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📢 Feed</h1>

      {}
      <form
        onSubmit={handleCreatePost}
        className="mb-8 bg-gray-800 p-6 rounded-xl shadow-md max-w-xl mx-auto"
      >
        <input
          type="text"
          placeholder="Naslov posta..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-gray-700 text-white focus:outline-none"
        />
        <textarea
          placeholder="Sadržaj..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-gray-700 text-white focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
        >
          Objavi
        </button>
      </form>

      {}
      {loading ? (
        <p className="text-center text-gray-400">Učitavanje postova...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-400">Još uvek nema postova.</p>
      ) : (
        <div className="space-y-6 max-w-2xl mx-auto">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-2xl transition"
            >
              <h2 className="text-2xl font-semibold text-blue-400">
                {post.title}
              </h2>
              <p className="text-gray-300 mt-2">{post.content}</p>

              {}
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Autor:{" "}
                  <span className="text-gray-300">
                    {post.author?.name || "Nepoznat"}
                  </span>
                </p>

                <button
                  onClick={() => handleLike(post.id)}
                  className={`${
                    likedPosts.includes(post.id)
                      ? "text-red-500"
                      : "text-gray-400 hover:text-red-400"
                  } transition text-xl`}
                >
                  ❤️
                </button>
              </div>

              <p className="text-xs text-gray-600 mt-1">
                Objavljeno: {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}