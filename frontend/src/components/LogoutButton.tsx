import React from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <button onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md">
            Logout
        </button>
    );
}