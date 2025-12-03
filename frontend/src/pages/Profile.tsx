import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  profileImage?: string | null; 
}

export default function Profile() {
  const { user, login, logout } = useAuth();

  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me");
        const data: ProfileData = res.data;

        setProfile(data);
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        console.error("Nije moguće učitati profil", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setUpdatingProfile(true);
    try {
      const res = await api.patch("/users/update", { name, email });
      const updatedUser: ProfileData = res.data;

      setProfile(updatedUser);

      
      const token = localStorage.getItem("accessToken") || "";
      login(
        {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
        },
          token
      );
      alert("Profil uspešno ažuriran ✅");
    } catch (err) {
      console.error("Greška pri ažuriranju profila", err);
      alert("Greška pri ažuriranju profila");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  
  const handleUploadProfileImage = async () => {
    if (!selectedFile) {
      alert("Prvo izaberi sliku.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      
      formData.append("file", selectedFile);

      const res = await api.post("/upload/profile", formData, {
        headers: {
          
          "Content-Type": "multipart/form-data",
        },
      });

      
      const updatedUser = res.data.file as ProfileData;

      setProfile(updatedUser);

      
      const token = localStorage.getItem("accessToken") || "";
      login(
        {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          profileImage: res.data.profileImage ?? user?.profileImage, 
        },
        token
      );

      alert("Profilna slika uspešno uploadovana ✅");
      setSelectedFile(null);
    } catch (err) {
      console.error("Greška pri uploadu slike", err);
      alert("Greška pri uploadu slike");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Učitavanje profila...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Nije moguće učitati profil.</p>
      </div>
    );
  }

  
  const profileImageUrl = profile.profileImage
    ? `http://localhost:3000/${profile.profileImage.replace(/^\.?\//, "")}`
    : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      <Navbar />

      <div className="p-6 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Moj profil</h1>

        
        <div className="flex flex-col items-center mb-6">
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
          <p className="text-gray-300">{profile.email}</p>
        </div>

        
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">
            Promeni profilnu sliku
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-300"
          />
          <button
            onClick={handleUploadProfileImage}
            disabled={uploading || !selectedFile}
            className="mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded w-full"
          >
            {uploading ? "Otpremanje..." : "Uploaduj sliku"}
          </button>
        </div>

        
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Ime</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={updatingProfile}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded w-full"
          >
            {updatingProfile ? "Čuvanje..." : "Ažuriraj profil"}
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      </div>
    </div>
  );
}