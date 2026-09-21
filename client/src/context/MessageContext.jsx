const { createContext, useContext } = require("react");

const MessageContext = createContext(null);

export function MessageProvider({ children }) {

}

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) throw new Error("useMessage must be in a MessageProvier");
    
    return context;
}