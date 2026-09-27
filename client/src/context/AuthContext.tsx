import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../utils/config";
import toast from "react-hot-toast";

interface User {
    id: number;
    username: string;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode}) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Check for existing token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("authUser");

        if (storedToken && storedUser) {
            // Hydrating auth state on mount, so we can update state
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false)
    }, [])

    const login = async (username: string, password: string) => {
        const loginOperation = async () => {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ username, password})
            });
            if (!response.ok) throw new Error("Login failed");
            return await response.json();
        }

        toast.promise(loginOperation(), {
            loading: "Login...",
            success: (data) => {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem("authUser", JSON.stringify(data.user));
                localStorage.setItem("authToken", data.token);
                return `Welcome back, ${data.user.username}`
            },
            error: (err) => {return `Login failed ${err.message}`}
        })
    }

    const register = async (username: string, password: string) => {
        const registerOperation = async () => {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password})
            })
            if (!response.ok) throw new Error("Register failed");
            return await response.json();
        } 

        toast.promise(registerOperation(), {
            loading: "Register...",
            success: (data) => {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem("authUser", JSON.stringify(data.user));
                localStorage.setItem("authToken", data.token);
                return `Account created! Welcome ${data.user.username}`
            },
             error: (err) => {return `Register failed ${err.message}`}
        })
    } 

    // Clean stored/state data on leave
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
        
        toast.success("Successfully logged out!");
    }

    const value: AuthContextType = {
        token,
        user,
        isLoading,
        register,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be in a AuthProvider");
    
    return context;
}   