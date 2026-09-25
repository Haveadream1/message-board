import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

// ? Might need to be a env variable after deploy 
const API_URL = "http://localhost:3000/api/messages";

// Define types of message state
interface FormState {
    username: string;
    message: string;
}

export interface Message extends FormState {
    id: string;
    createdAt: string;
    likeCount: number
}

// Define the shape of the entire context value
interface MessageContextType {
    formData: FormState;
    handleDataChange: (label: keyof FormState, value: string) => void;
    messages: Message[];
    storeMessages: (newMessage: {username: string, message: string}) => void;
    cleanForm: () => void;
    updateLikeCount: (id: string) => void;
    deleteMessage: (id: string) => void;
    isLoaderEnable: boolean;
}

// Tell TypeScript the context can be MessageContextType OR null initially
const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({ children }: { children: React.ReactNode}) {
    const [isLoaderEnable, setIsLoaderEnable] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const [formData, setFormData] = useState<FormState>({
        username: "",
        message: ""
    });

    // !Note: don't toast on mount -> only user interactions
    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoaderEnable(true);
            try {
                const response = await fetch(API_URL);
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

    const pushMessageToArr = (newMessage : Message) => {
        setMessages((prev) => [...prev, newMessage]);
    }

    // Toast library handle the promise rejection, we can drop try/catch
    const storeMessages = async (newMessage: { username: string, message: string }) => {
        const storeOperation = async () => {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(newMessage)
            })
            if (!response.ok) throw new Error("Failed to post message");
            return await response.json();
        }

        toast.promise(storeOperation(), {
            loading: "Storing message...",
            success: (savedMessage) => {
                pushMessageToArr(savedMessage);
                return "Successfully stored message"
            },
            error: "Failed to save message"
        })
    }

    const updateLikeCount = async (id: string) => {
        const updateOperation = async () => {
            // Backend handle the incrementation
            const response = await fetch(`${API_URL}/${id}/like`, {
                method: "PUT",
                headers: {"Content-type": "application/json"}
            })

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
            error: "Failed to update like count"
        })
    }

    const deleteMessage = async (id: string) => {
        const confirmation = window.confirm("Are you sure you want to delete this message ?");
        if (!confirmation) return; // Stop execution if user cancel deletion

        const deleteOperation = async () => {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {"Content-type": "application/json"}
            })
            if (!response.ok) throw new Error("Failed to delete message");
            return await response.json();
        }

        toast.promise(deleteOperation(), {
            loading: "Deleting message...",
            success: (deletedMessage) => {
                // Debugg
                console.log(deletedMessage);

                setMessages((prev) => 
                    prev.filter((message) => message.id !== id)
                )
                return "Successfully deleted message";
            }, 
            error: "Failed to delete message"
        })
    }

    // "keyof" ensures we can ONLY pass "username" or "message"
    const handleDataChange = (label: keyof FormState, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [label]: value
        }))
    }

    const cleanForm = () => {
        setFormData({
            username: "",
            message: ""
        })
    }

    const value: MessageContextType = {
        formData,
        handleDataChange,
        messages,
        cleanForm,
        storeMessages,
        updateLikeCount,
        deleteMessage,
        isLoaderEnable
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