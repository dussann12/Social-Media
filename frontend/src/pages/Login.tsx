import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = res.data;

      login(user, accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      
      navigate("/feed", { replace: true });
    } catch (err: any) {
      console.error("Greška pri loginu", err.response?.data || err.message);
      toast.error("Neuspešan login! Proveri email/lozinku.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col w-80"
      >
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-2 rounded bg-gray-700 text-white focus:outline-none"
        />

        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 p-2 rounded bg-gray-700 text-white focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
        >
          {loading ? "Prijavljivanje..." : "Uloguj se"}
        </button>

        <p className="text-gray-400 text-sm text-center mt-4">
          Nemaš nalog?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Registruj se
          </Link>
        </p>
      </form>
    </div>
  );
}