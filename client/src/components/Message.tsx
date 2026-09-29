interface MessageProps {
    username: string;
    message: string;
    date: string;
    likeCount: number;
    isDeleteVisible: boolean;
    isMessageLiked: boolean;
    onLikeClick: () => void;
    onDeleteClick: () => void;
}

export default function Message({ 
    username, message, date, likeCount, isDeleteVisible, isMessageLiked, 
    onLikeClick, onDeleteClick 
}: MessageProps) {
    return (
        <div className="grid gap-4 p-5 bg-white border-2 rounded-md border-light-grey">
            <div className="flex justify-between">
                <p className="text-lg font-medium">{username}</p>
                <p className="text-gray-500">{date}</p>
            </div>

            <p>{message}</p>

            <div className="flex justify-between pt-2 gap-4 border-t-2 border-light-grey">
                <div className="flex gap-4">
                    <div className="flex gap-2">
                        <button id="like-btn" type="button" onClick={onLikeClick} aria-labelledby="likeSpan">
                            {isMessageLiked ? (
                                <img src="../src/assets/filled_like.svg" alt="Like" width={20} height={20}/>
                            ):(
                                <img src="../src/assets/like.svg" alt="Like" width={20} height={20}/>
                            )}
                        </button>
                        <span id="likeSpan">{likeCount}</span>
                    </div>

                    {/* Prepared for reply */}
                    {/* <div className="flex gap-2">
                        <button id="reply-btn" type="button" aria-labelledby="replySpan">
                            <img src="../src/assets/reply.svg" alt="" aria-hidden="true" width={20} height={20} />
                        </button>
                        <span id="replySpan">Reply</span>
                    </div> */}
                </div>

                {isDeleteVisible && (
                    <div className="flex gap-2">
                        <button id="reply-btn" type="button" onClick={onDeleteClick}>
                            <img src="../src/assets/delete.svg" alt="Delete" width={20} height={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}