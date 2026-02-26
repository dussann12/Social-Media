import { useEffect, useState } from "react";
import { getFriendRequests, acceptFriendRequest, declineFriendRequest } from "../api/friend";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

interface FriendRequest {
  id: number;
  status: string;
  requester: {
    id: number;
    name: string;
    email: string;
  };
}

export default function FriendRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getFriendRequests();
      setRequests(data);
    } catch (err: any) {
      console.error("Greška pri dohvatanju zahteva za prijateljstvo", err);
      setError("Nije moguće učitati zahteve.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId: number) => {
    try {
      await acceptFriendRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Greška pri prihvatanju zahteva", err);
      toast.error("Greška pri prihvatanju zahteva.");
    }
  };

  const handleDecline = async (requestId: number) => {
    try {
      await declineFriendRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Greška pri odbijanju zahteva", err);
      toast.error("Greška pri odbijanju zahteva.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Zahtevi za prijateljstvo
      </h1>

      {loading && (
        <p className="text-center text-gray-400">Učitavanje zahteva...</p>
      )}

      {error && (
        <p className="text-center text-red-400 mb-4">{error}</p>
      )}

      {!loading && !error && requests.length === 0 && (
        <p className="text-center text-gray-400">
          Trenutno nema zahteva za prijateljstvo.
        </p>
      )}

      {!loading && !error && requests.length > 0 && (
        <div className="space-y-4 max-w-xl mx-auto">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-gray-800 p-4 rounded-xl shadow-md flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">
                  {req.requester?.name || "Nepoznat korisnik"}
                </p>
                <p className="text-gray-400 text-sm">
                  {req.requester?.email}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAccept(req.id)}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                >
                  Prihvati
                </button>
                <button
                  onClick={() => handleDecline(req.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                >
                  Odbij
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}