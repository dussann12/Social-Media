import { Children, createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    user: any;
    token: string | null;
    login: (userData: any, token: string ) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user,setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if(storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: any, token: string) => {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user",JSON.stringify(userData));
        setUser(userData);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
        window.location.href = "/login";
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth mora biti koriscen unutar AuthProvider-a");
    }
    return context;
};