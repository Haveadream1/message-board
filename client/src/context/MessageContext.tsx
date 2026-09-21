import { createContext, useContext, useState } from "react";

// Define types of message state
interface FormState {
    username: string;
    message: string;
}

export interface Message extends FormState {
    id: string;
}

// Define the shape of the entire context value
interface MessageContextType {
    formData: FormState;
    handleDataChange: (label: keyof FormState, value: string) => void;
    messages: Message[];
    pushMessageToArr: (message : Message) => void;
    cleanForm: () => void;
}

// Tell TypeScript the context can be MessageContextType OR null initially
const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({ children }: { children: React.ReactNode}) {
    const [messages, setMessages] = useState<Message[]>([]);

    const [formData, setFormData] = useState<FormState>({
        username: "",
        message: ""
    });

    // "keyof" ensures we can ONLY pass "username" or "message"
    const handleDataChange = (label: keyof FormState, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [label]: value
        }))
    }

    const pushMessageToArr = (newMessage : Message) => {
        setMessages((prev) => [...prev, newMessage]);
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
        pushMessageToArr,
        cleanForm
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