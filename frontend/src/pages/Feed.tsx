import { useEffect, useState } from "react";
import api from "../api/axios";
import CommentsSection from "../components/CommentsSection";

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
  likes?: any[];
  comments?: any[];
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [likedPosts, setLikedPosts] = useState<number[]>([]); 
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts(res.data);
      } catch (err) {
        console.error("Greška pri dohvatanju postova", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user.id]);


  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await api.post("/posts/create", { title, content });
      setPosts((prev) => [res.data, ...prev]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Greška pri kreiranju posta", err);
    }
  };

  const handleLike = async (postId: number) => {
  try {
    const token = localStorage.getItem("accessToken");
    await api.post(`/likes/${postId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: likedPosts.includes(postId)
                ? post.likes?.slice(0, -1)
                : [...(post.likes || []), { userId: 1 }], 
            }
          : post
      )
    );

    
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  } catch (err) {
    console.error("Greška pri lajkovanju", err);
  }
};

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
                  {likedPosts.includes(post.id) ? "❤️" : "🤍"}
                </button>
              </div>

              <div className="flex items-center space-x-4 text-gray-400 text-sm mt-2">
                <p>❤️ {post.likes?.length || 0}</p>
                <p>💬 {post.comments?.length || 0}</p>
              </div>

              <p className="text-xs text-gray-600 mt-1">
                Objavljeno: {new Date(post.createdAt).toLocaleString()}
              </p>

              <CommentsSection postId={post.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}