import { useEffect, useState } from "react";
import { getFriends, Friend } from "../api/friend";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Friends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const data = await getFriends();
        setFriends(data);
      } catch (err) {
        console.error("Greška pri dohvatanju prijatelja", err);
        toast.error("Ne mogu da učitam listu prijatelja.");
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Prijatelji</h1>

        {loading ? (
          <p className="text-center text-gray-400">Učitavanje prijatelja...</p>
        ) : friends.length === 0 ? (
          <p className="text-center text-gray-400">
            Nemate prijatelja još uvek.
          </p>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="bg-gray-800 p-4 rounded-xl shadow flex items-center justify-between"
              >
                <div>
                  <Link
                    to={`/users/${friend.id}`}
                    className="font-semibold hover:text-blue-400"
                  >
                    {friend.name || "Bez imena"}
                  </Link>
                  <p className="text-sm text-gray-400">{friend.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
