import { useState } from "react";
import { Aside } from "../components/Aside";
import Message from "../components/Message";
import { Button } from "../components/ui/Buttons";
import MsgForm from "./MsgForm";

import { useMessage } from "../context/MessageContext";
import { useAuth } from "../context/AuthContext";

import loader from "../assets/loader.svg";


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
                        <img 
                            src={loader}
                            alt="Loader" 
                            width={20} 
                            height={20} 
                            className="animate-spin"
                        />
                    </div>
                )}
                
                {isFormEnable ? (
                    <MsgForm onOpenForm={() => setIsFormEnable(false)} />
                ) : (
                    !isLoaderEnable &&
                    hasMore && (
                        <div className="flex justify-center">
                            <Button
                                type="button"
                                onClick={loadMoreMessages}
                                disabled={isFetchingMore}
                                color="purple"
                                padding="even"
                                disabledStyle={true}
                                focusStyle={true}
                            >
                                {isFetchingMore ? "Loading" : "Load more messages"}
                            </Button>
                        </div>
                    )
                )}
            </div>
        </main>
    )
}

// Format timestamp to show yyyy-mm-dd hh-mm, only format on frontend to be able to sort it in backend if needed