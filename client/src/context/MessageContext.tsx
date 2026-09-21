import { createContext, useContext, useState } from "react";

// Define shap of message state
interface MessageState {
    username: string;
    message: string;
}

// Define the shape of the entire context value
interface MessageContextType {
    messageFormData: MessageState;
    handleDataChange: (label: keyof MessageState, value: string) => void;
    cleanForm: () => void;
}

// Tell TypeScript the context can be MessageContextType OR null initially
const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({ children }: { children: React.ReactNode}) {
    const [messageFormData, setMessageFormData] = useState<MessageState>({
        username: "",
        message: ""
    });

    // "keyof" ensures we can ONLY pass "username" or "message"
    const handleDataChange = (label: keyof MessageState, value: string) => {
        setMessageFormData((prev) => ({
            ...prev,
            [label]: value
        }))
    }

    const cleanForm = () => {
        setMessageFormData({
            username: "",
            message: ""
        })
    }

    const value: MessageContextType = {
        messageFormData,
        handleDataChange,
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
    if (!context) throw new Error("useMessage must be in a MessageProvier");
    
    return context;
}