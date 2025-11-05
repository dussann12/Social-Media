import axios from "axios";

export const testApi = async () => {
    try {
        const res = await axios.post("http://localhost:3000/auth/login", {
            email: "dulupdatede@gmail.com",
            password: "dule1234"
        });
        console.log("Login uspesan", res.data);
    } catch (err) {
        console.error("Greska pri konekciji sa backendom:", err);
    }
};