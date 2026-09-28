import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_URL } from "../utils/config";
import { useAuth } from "./AuthContext";

// Define types
interface Message {
    id: string;
    message: string;
    createdAt: string;
    likeCount: number;
}

// Define the shape of the entire context value
interface MessageContextType {
    isLoaderEnable: boolean;
    messages: Message[];
    formData: string;
    storeMessages: (messageText: string) => Promise<void>;
    updateLikeCount: (id: string) => Promise<void>;
    deleteMessage: (id: string) => Promise<void>;
    setFormData: (formData: string) => void;
}

// Tell TypeScript the context can be MessageContextType OR null initially
const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({ children }: { children: React.ReactNode}) {
    const [isLoaderEnable, setIsLoaderEnable] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [formData, setFormData] = useState("");

    // Get value and function from auth context
    const {token, logout} = useAuth();

    // !Note: don't toast on mount -> only user interactions
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${API_URL}/messages`);
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error("Failed to fetch messages: ", error);
            } finally {
                setIsLoaderEnable(false);
            }
        }
        fetchMessages();
    }, []);

    // Toast library handle the promise rejection, we can drop try/catch
    const storeMessages = async (messageText: string) => {
        // Check user token
        if (!token) {
            toast.error("You must be logged in to post");
            return;
        }

        const storeOperation = async () => {
            const response = await fetch(`${API_URL}/messages`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({message: messageText})
            })

            // Logout if token is expired
            if (response.status === 401) {
                logout();
                throw new Error("Session expired, please log in again")
            }

            if (!response.ok) throw new Error("Failed to post message");
            return await response.json();
        }

        toast.promise(storeOperation(), {
            loading: "Storing message...",
            success: (savedMessage) => {
                setMessages((prev) => [...prev, savedMessage]);
                setFormData("");
                return "Successfully stored message"
            },
            error: (err) => err.message // Error defined in the backend will be displayed
        })
    }

    const updateLikeCount = async (id: string) => {
        const updateOperation = async () => {
            // Backend handle the incrementation
            const response = await fetch(`${API_URL}/messages/${id}/like`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (response.status === 401) {
                logout();
                throw new Error("Session expired, please log in again");
            }

            if (response.status === 409) throw new Error("You already liked this message");

            if (!response.ok) throw new Error("Failed to update like count");
            return await response.json();
        }

        toast.promise(updateOperation(), {
            loading: "Updating likes...",
            success: (updatedMessage) => {
                setMessages((prev) => 
                    prev.map((message) => message.id === id ? updatedMessage : message)
                );
                return "Successfully updated likes";
            },
            error: (err) => err.message
        })
    }

    const deleteMessage = async (id: string) => {
        const confirmation = window.confirm("Are you sure you want to delete this message ?");
        if (!confirmation) return; // Stop execution if user cancel deletion

        if (!token) {
            toast.error("You must be logged in to post");
            return;
        }

        const deleteOperation = async () => {
            const response = await fetch(`${API_URL}/messages/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (response.status === 401) {
                logout();
                throw new Error("Session expired, please log in again")
            }

            if (response.status === 403) throw new Error("Forbidden: You can only delete your own messages  ");

            if (!response.ok) throw new Error("Failed to delete message");
            return await response.json();
        }

        toast.promise(deleteOperation(), {
            loading: "Deleting message...",
            success: () => {
                setMessages((prev) => 
                    prev.filter((message) => message.id !== id)
                )
                return "Successfully deleted message";
            }, 
            error: (err) => err.message
        })
    }

    const value: MessageContextType = {
        isLoaderEnable,
        messages,
        formData,
        storeMessages,
        updateLikeCount,
        deleteMessage,
        setFormData
    };

    return (
        <MessageContext.Provider value={value}>
            {children}
        </MessageContext.Provider>
    )
}

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) throw new Error("useMessage must be in a MessageProvider");
    
    return context;
}