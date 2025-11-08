import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const res = await api.post("/auth/login", {
                email,
                password,
            });
            const { accessToken, user } = res.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("user", JSON.stringify(user));


            console.log("Login uspesan", res.data);
            alert("Uspesan login");

            navigate("/feed");
        } catch (err: any) {
            console.error("Greska pri loginu", err.response?.data || err.message);
            alert("Neuspesan login");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <form
              onSubmit={handleLogin}
              className="bg-gray-800 p-8 rounded-2x1 shadow-lg flex flex-col w-80">
                <h2 className="text-white text-2x1 font-bold mb-6 text-center">Login</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-4 p-2 rounded bg-gray-700 text-white focus:outline-none"/>
                <input
                  type="password"
                  placeholder="Lozinka"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-6 p-2 rounded bg-gray-700 text-white focus:outline-none"/>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded">
                    {loading ? "Prijavljivanje..." : "Uloguj se"}
                </button>
            </form>
        </div>
    );
}