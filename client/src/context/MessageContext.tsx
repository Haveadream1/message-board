import { createContext, useContext, useEffect, useState } from "react";

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
}

// Tell TypeScript the context can be MessageContextType OR null initially
const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({ children }: { children: React.ReactNode}) {
    const [messages, setMessages] = useState<Message[]>([]);

    const [formData, setFormData] = useState<FormState>({
        username: "",
        message: ""
    });

    // const [likeCount, setLikeCount] = useState<number>(0);

    // ? Should URL or at least PORT an env variables, or in all cases it will changes later with the DB call
    // Run at every loads, need to export to also init it after message creation ?
    useEffect(() => {
        const fetchMessages = async () => {
            const URL = "http://localhost:3000/api/messages";
            try {
                const response = await fetch(URL);
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error("Failed to fetch messages: ", error);
            } finally {
                // set off the loader
            }
        }
        fetchMessages();
    }, []);

    const pushMessageToArr = (newMessage : Message) => {
        setMessages((prev) => [...prev, newMessage]);
    }

    const storeMessages = async (newMessage: { username: string, message: string }) => {
        const URL = "http://localhost:3000/api/messages";
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(newMessage)
            })

            if (!response.ok) throw new Error("Failed to post message");
            
            const savedMessage = await response.json();
            pushMessageToArr(savedMessage);
        } catch (error) {
            console.error("Failed to store message to the backend: ", error);
            alert("Failed to save message. Please try again !");
        }
    }

    // ?? good practice to make the URL a common constant ?
    const updateLikeCount = async (id: string) => {
        try {
            // Backend handle the incrementation
            const response = await fetch(`http://localhost:3000/api/messages/${id}/like`, {
                method: "PUT",
                headers: {"Content-type": "application/json"}
            })

            if (!response.ok) throw new Error("Failed to update like count");
            const updatedMessage = await response.json();
            console.log(updatedMessage);

            // Update the state array
            setMessages((prev) => 
                prev.map((message) => message.id === id ? updatedMessage : message)
            );
        } catch (error) {
            console.error("Failed to update like count: ", error);
        }
    }

    const deleteMessage = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/messages/${id}`, {
                method: "DELETE",
                headers: {"Content-type": "application/json"}
            })
            if (!response.ok) throw new Error("Failed to delete message");
            const deletedMessage = await response.json();
            console.log(deletedMessage);

            // Update the state array, keeping all messages besides the one we delete
            setMessages((prev) =>
                prev.filter((message) => message.id !== id)
            )
        } catch (error) {
            console.error("Failed to delete message: ", error);
        }
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
        deleteMessage
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