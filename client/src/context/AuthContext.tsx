import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/config";

interface User {
    id: number;
    username: string;
}

interface FormType {
    username: string;
    password: string;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    formData: FormType;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
    handleDataChange: (label: keyof FormType, value: string) => void;
    cleanFormData: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode}) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState<FormType>({
        username: "",
        password: ""
    })

    const navigate = useNavigate();
        
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
            const response = await fetch(`${API_URL}/api/auth/login`, {
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
                navigate("/");
                return `Welcome back, ${data.user.username}`
            },
            error: (err) => err.message
        })
    }

    const register = async (username: string, password: string) => {
        const registerOperation = async () => {
            const response = await fetch(`${API_URL}/api/auth/register`, {
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
                navigate("/");
                return `Account created! Welcome ${data.user.username}`
            },
            error: (err) => err.message
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

    // keyof ensure we can only pass label defined in interface
    const handleDataChange = (label: keyof FormType, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [label]: value
        }))
    }

    const cleanFormData = () => {
        setFormData({
            username: "",
            password: ""
        })
    }

    const value: AuthContextType = {
        token,
        user,
        isLoading,
        formData,
        register,
        login,
        logout,
        handleDataChange,
        cleanFormData
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