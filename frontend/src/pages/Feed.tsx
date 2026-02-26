import { useEffect, useState } from "react";
import api from "../api/axios";
import CommentsSection from "../components/CommentsSection";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  author?: {
    id: number;
    name: string;
    email: string;
    profileImage?: string | null;
  };
  createdAt: string;
  likes?: any[];
  comments?: any[];
  commentsCount?: number;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/posts");

        const data = res.data as Post[];

        const withCounts = data.map((post) => ({
          ...post,
          commentsCount: post.comments ? post.comments.length : 0,
        }));

        setPosts(withCounts);

        const likedByUser = withCounts
          .filter((post: any) =>
            post.likes?.some((like: any) => like.userId === user.id)
          )
          .map((post) => post.id);

        setLikedPosts(likedByUser);
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
      let newPost: Post = {
        ...res.data,
        commentsCount: 0,
        likes: [],
        comments: [],
      };

      if (postImage) {
        const formData = new FormData();
        formData.append("file", postImage);
        const uploadRes = await api.post(`/upload/posts/${newPost.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        newPost = { ...newPost, imageUrl: uploadRes.data.imageUrl };
      }

      setPosts((prev) => [newPost, ...prev]);
      setTitle("");
      setContent("");
      setPostImage(null);
      toast.success("Post je objavljen.");
    } catch (err) {
      console.error("Greška pri kreiranju posta", err);
      toast.error("Greška pri kreiranju posta.");
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const res = await api.post(`/likes/${postId}`, {});
      const { liked } = res.data;

      setLikedPosts((prev) =>
        liked ? [...prev, postId] : prev.filter((id) => id !== postId)
      );

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: liked
                  ? [...(post.likes || []), { userId: user.id }]
                  : (post.likes || []).filter((l: any) => l.userId !== user.id),
              }
            : post
        )
      );
    } catch (err) {
      console.error("Greška pri lajkovanju", err);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete post?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Post je obrisan.");
    } catch (err) {
      console.error("Greška pri brisanju posta", err);
      toast.error("Greška pri brisanju posta.");
    }
  };

  const startEditing = (post: Post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content || "");
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleEditPost = async (postId: number) => {
    try {
      const res = await api.patch(`/posts/${postId}`, {
        title: editTitle,
        content: editContent,
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, title: res.data.title, content: res.data.content }
            : p
        )
      );
      cancelEditing();
      toast.success("Post je ažuriran.");
    } catch (err) {
      console.error("Greška pri ažuriranju posta", err);
      toast.error("Greška pri ažuriranju posta.");
    }
  };

  const handleCommentsCountChange = (postId: number, delta: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentsCount: (post.commentsCount || 0) + delta,
            }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Feed</h1>

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
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => setPostImage(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-300 mb-3"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
          >
            Objavi
          </button>
        </form>

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
                {editingPostId === post.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPost(post.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                      >
                        Sačuvaj
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-1 rounded"
                      >
                        Otkaži
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-blue-400">
                        {post.title}
                      </h2>
                      {post.author?.id === user.id && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditing(post)}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            Izmeni
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Obriši
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 mt-2">{post.content}</p>
                  </>
                )}

                {post.imageUrl && (
                  <img
                    src={`http://localhost:3000/${post.imageUrl.replace(/^\.?\//, "")}`}
                    alt="Slika posta"
                    className="mt-3 rounded-lg max-h-96 w-full object-cover"
                  />
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {post.author?.profileImage ? (
                      <img
                        src={`http://localhost:3000/${post.author.profileImage.replace(/^\.?\//, "")}`}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                        {post.author?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <span className="text-sm text-gray-300">
                      {post.author?.name || "Nepoznat"}
                    </span>
                  </div>

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
                  <p>❤️ {post.likes?.length ?? 0}</p>
                  <p>💬 {post.commentsCount || 0}</p>
                </div>

                <p className="text-xs text-gray-600 mt-1">
                  Objavljeno: {new Date(post.createdAt).toLocaleString()}
                </p>

                <CommentsSection
                  postId={post.id}
                  onCommentsCountChange={(delta) =>
                    handleCommentsCountChange(post.id, delta)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
