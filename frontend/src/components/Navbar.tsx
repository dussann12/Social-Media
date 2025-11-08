import React from "react";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <nav className="flex items-center justify-between px-6 py-3 bg-gray-800 text-white shadow-md">
            <h1 className="text-xl font-bold">Social Media App</h1>

            <div className="flex items-center gap-4">
                <span className="text-gray-300">
                    {user.name || "Korisnik"}
                </span>
                <LogoutButton />
            </div>
        </nav>
    );
}