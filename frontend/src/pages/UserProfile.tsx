import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

interface UserProfileData {
  id: number;
  name: string;
  email: string;
  profileImage?: string | null;
  createdAt: string;
}

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Greška pri učitavanju profila korisnika", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const profileImageUrl = profile?.profileImage
    ? `http://localhost:3000/${profile.profileImage.replace(/^\.?\//, "")}`
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center p-6">
          <p className="text-gray-400">Učitavanje profila...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center p-6">
          <p className="text-gray-400">Korisnik nije pronađen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-6 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-xl">
          <div className="flex flex-col items-center">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profilna slika"
                className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-blue-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl mb-3">
                {profile.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <h1 className="text-2xl font-bold">
              {profile.name || "Bez imena"}
            </h1>
            <p className="text-gray-400">{profile.email}</p>
            <p className="text-gray-500 text-sm mt-2">
              Registrovan: {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
