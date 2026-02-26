import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { sendFriendRequest } from "../api/friend";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

interface User {
  id: number;
  name: string | null;
  email: string;
}

export default function Users() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingTo, setSendingTo] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get<User[]>("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Greška pri dohvatanju korisnika", err);
        toast.error("Ne mogu da učitam korisnike.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddFriend = async (receiverId: number) => {
    if (!currentUser) {
      toast.error("Moraš biti ulogovan.");
      return;
    }

    if (receiverId === currentUser.id) {
      toast.error("Ne možeš poslati zahtev sam sebi.");
      return;
    }

    try {
      setSendingTo(receiverId);
      await sendFriendRequest(receiverId);
      toast.success("Zahtev za prijateljstvo je poslat.");
    } catch (err) {
      console.error("Greška pri slanju zahteva", err);
      toast.error("Ne mogu da pošaljem zahtev za prijateljstvo.");
    } finally {
      setSendingTo(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-300 text-lg">Učitavanje korisnika...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Korisnici</h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-400">Još uvek nema korisnika.</p>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-gray-800 p-4 rounded-xl shadow flex items-center justify-between"
            >
              <div>
                <Link to={`/users/${u.id}`} className="font-semibold hover:text-blue-400">
                  {u.name || "Bez imena"}{" "}
                  {currentUser?.id === u.id && (
                    <span className="text-xs text-blue-400">(ti)</span>
                  )}
                </Link>
                <p className="text-sm text-gray-400">{u.email}</p>
              </div>

              {currentUser?.id === u.id ? (
                <span className="text-gray-500 text-sm">Tvoj nalog</span>
              ) : (
                <button
                  onClick={() => handleAddFriend(u.id)}
                  disabled={sendingTo === u.id}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 px-4 rounded-lg"
                >
                  {sendingTo === u.id ? "Slanje..." : "Dodaj prijatelja"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}