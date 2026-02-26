import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      console.log("Registracija uspešna", res.data);
      toast.success("Uspešno ste se registrovali!");

     
      window.location.href = "/login";
    } catch (err: any) {
      console.error("Greška pri registraciji", err.response?.data || err.message);
      toast.error("Neuspešna registracija!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col w-80"
      >
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          Registracija
        </h2>

        <input
          type="text"
          placeholder="Ime"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 p-2 rounded bg-gray-700 text-white focus:outline-none"
        />

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
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded disabled:bg-green-300"
        >
          {loading ? "Registracija..." : "Registruj se"}
        </button>

        <p className="text-gray-400 text-sm text-center mt-4">
          Već imate nalog?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Uloguj se
          </a>
        </p>
      </form>
    </div>
  );
}