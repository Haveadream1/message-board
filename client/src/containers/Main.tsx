import { useState } from "react";
import { Aside } from "../components/Aside";
import Message from "../components/Message";
import { useMessage } from "../context/MessageContext";
import MsgForm from "./MsgForm";
import { useAuth } from "../context/AuthContext";

export default function Main() {
    const [isFormEnable, setIsFormEnable] = useState(false);
    const { messages, updateLikeCount, deleteMessage, isLoaderEnable } = useMessage();
    const {user} = useAuth();

    const displayDeleteIcon = (username: string) => {
        if (user?.username === username) {
            return true;
        }
        return false;
    }
    
    return (
        <main className="pt-5 flex flex-col gap-5 sm:grid grid-cols-[1fr_3fr]">
            <Aside 
                onOpenForm={() => setIsFormEnable(true)}
                disabled={isFormEnable}
            />

            <div id="message-container" className="flex flex-col gap-5">
                {!messages ? (
                    <span className="text-center">No messages yet, be the first !</span>
                ):(
                    messages.map((message) =>
                        <Message 
                            key={message.id}
                            username={message.username}
                            message={message.message}
                            date={message.createdAt.slice(0, 16).replace("T", " ")}
                            likeCount={message.likeCount}
                            isDeleteVisible={displayDeleteIcon(message.username)}
                            onLikeClick={() => updateLikeCount(message.id)}
                            onDeleteClick={() => deleteMessage(message.id)}
                        />
                    ) 
                )}
                            
                {isLoaderEnable && (
                    <div className="flex justify-center">
                        <img src="../src/assets/loader.svg" alt="Loader" width={20} height={20} className="animate-spin"/>
                    </div>
                )}
                
                {isFormEnable && (
                    <MsgForm onOpenForm={() => setIsFormEnable(false)} />
                )}
            </div>
        </main>
    )
}

// Format timestamp to show yyyy-mm-dd hh-mm, only format on frontend to be able to sort it in backend if needed