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
    likedMessagesId: Set<string>;
    page: number;
    hasMore: boolean;
    isFetchingMore: boolean;
    loadMoreMessages: () => Promise<void>;
    storeMessages: (messageText: string) => Promise<void>;
    likeMessage: (id: string) => Promise<void>;
    dislikeMessage: (id: string) => Promise<void>;
    deleteMessage: (id: string) => Promise<void>;
    setFormData: (formData: string) => void;
}

// Tell TypeScript the context can be MessageContextType OR null initially
const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({ children }: { children: React.ReactNode}) {
    const [isLoaderEnable, setIsLoaderEnable] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const [formData, setFormData] = useState("");
    const [likedMessagesId, setLikedMessagesId] = useState<Set<string>>(new Set());

    // Get value and function from auth context
    const {token, logout} = useAuth();

    // Constante
    const MESSAGES_LIMIT = 3;

    // !Note: don't toast on mount -> only user interactions
    useEffect(() => {
        const fetchInitialMessages = async () => {
            try {
                const response = await fetch(`${API_URL}/messages?page=1&limit=${MESSAGES_LIMIT}`);
                if (!response.ok) throw new Error("Failed to get messages");

                const data = await response.json();
                setMessages(data.messages);
                setHasMore(data.hasMore);
                setPage(1); // Init value
            } catch (error) {
                console.error("Failed to fetch messages: ", error);
            } finally {
                setIsLoaderEnable(false);
            }
        }
        fetchInitialMessages();
    }, []);

    useEffect(() => {
        const fetchLikedMessages = async () => {
            if (!token) return; // Only fetch if user is logged in

            try {
                const response = await fetch(`${API_URL}/messages/likes`, {
                    headers: { "Authorization": `Bearer ${token}`}
                });
                if (!response.ok) throw new Error("Failed to get liked messages");

                // Set has faster lookups O(1) with .has compared to O(n) with array .includes()
                const data = await response.json();
                setLikedMessagesId(new Set(data));
            } catch (error) {
                console.error("Failed to fetch liked messages: ", error);
            }
        }
        fetchLikedMessages();
    }, [token]);

    const loadMoreMessages = async () => {
        // Check if there is more messages in database
        if (isFetchingMore || !hasMore) return;

        setIsFetchingMore(true);
        const nextPage = page + 1;

        const loadMoreOperation = async () => {
            const response = await fetch(`${API_URL}/messages?page=${nextPage}&limit=${MESSAGES_LIMIT}`);
            if (!response.ok) throw new Error("Failed to load more messages");

            return await response.json();
        }

        toast.promise(loadMoreOperation(), {
            loading: "Loading more messages",
            success: (data) => {
                setMessages((prev) => [...prev, ...data.messages]);
                setHasMore(data.hasMore);
                setPage(nextPage);
                setIsFetchingMore(false);
                return "Successfully loaded more messages"
            },
            error: (err) => {
                setIsFetchingMore(false);
                return err.message;
            }
        });
    }

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
                // Display new message first, following ordering from backend
                setMessages((prev) => [savedMessage ,...prev]);
                setFormData("");
                return "Successfully stored message"
            },
            error: (err) => err.message // Error defined in the backend will be displayed
        })
    }

    const likeMessage = async (id: string) => {
        const likeOperation = async () => {
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

        toast.promise(likeOperation(), {
            loading: "Updating likes...",
            success: (updatedMessage) => {
                setMessages((prev) => 
                    prev.map((message) => message.id === id ? updatedMessage : message)
                );

                // Update the state to display after click
                setLikedMessagesId((prev) => new Set(prev).add(id));
                return "Successfully updated likes";
            },
            error: (err) => err.message
        })
    }

    const dislikeMessage = async (id: string) => {
        // No need for confirmation on dislike as it's not an irreversible operation
        const dislikeOperation = async () => {
            const response = await fetch(`${API_URL}/messages/${id}/like`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!response.ok) throw new Error("Failed to dislike messsage");
            return await response.json();
        }

        toast.promise(dislikeOperation(), {
            loading: "Disliking message...",
            success: (updatedMessage) => {
                setMessages((prev) => 
                    prev.map((message) => message.id === id ? updatedMessage : message)
                );

                // Create a copy of set to remove id from it
                setLikedMessagesId((prev) => {                    
                    const copySet = new Set(prev);
                    copySet.delete(id);
                    return copySet;
                })
                return "Message disliked!"
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
        likedMessagesId,
        page,
        hasMore,
        isFetchingMore,
        loadMoreMessages,
        storeMessages,
        likeMessage,
        dislikeMessage,
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