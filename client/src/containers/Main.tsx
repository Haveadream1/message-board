import { useState } from "react";
import { Aside } from "../components/Aside";
import Message from "../components/Message";
import { useMessage } from "../context/MessageContext";
import MsgForm from "./MsgForm";
import { useAuth } from "../context/AuthContext";

export default function Main() {
    const [isFormEnable, setIsFormEnable] = useState(false);
    
    const { 
        messages, isLoaderEnable, likedMessagesId, hasMore, isFetchingMore, 
        loadMoreMessages, likeMessage, deleteMessage, dislikeMessage 
    } = useMessage();
    const {user} = useAuth();

    const checkMessageOwner = (username: string) => {
        return user?.username === username ?  true : false;
    }

    const checkLikedState = (likedMessagesId: Set<string>, messageId: string) => {
        // Check which messages was liked by user
        return likedMessagesId.has(messageId) ? true : false;
    }

    const handleOnLikeClick = (likedMessagesId: Set<string>, messageId: string) => {
        const isMessageLiked = checkLikedState(likedMessagesId, messageId);

        // Increment or decrease like count if already liked
        return isMessageLiked ? dislikeMessage(messageId) : likeMessage(messageId);
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
                            isDeleteVisible={checkMessageOwner(message.username)}
                            isMessageLiked={checkLikedState(likedMessagesId, message.id)}
                            onLikeClick={() => handleOnLikeClick(likedMessagesId, message.id)}
                            onDeleteClick={() => deleteMessage(message.id)}
                        />
                    )
                )}
                            
                {isLoaderEnable && (
                    <div className="flex justify-center">
                        <img src="../src/assets/loader.svg" alt="Loader" width={20} height={20} className="animate-spin"/>
                    </div>
                )}
                
                {isFormEnable ? (
                    <MsgForm onOpenForm={() => setIsFormEnable(false)} />
                ) : (
                    !isLoaderEnable &&
                    hasMore && (
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={loadMoreMessages}
                                disabled={isFetchingMore}
                                className="bg-purple-500 text-white rounded-md p-3 font-medium hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isFetchingMore ? "Loading" : "Load more messages"}
                            </button>
                        </div>
                    )
                )}
            </div>
        </main>
    )
}

// Format timestamp to show yyyy-mm-dd hh-mm, only format on frontend to be able to sort it in backend if needed