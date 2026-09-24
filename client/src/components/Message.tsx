interface MessageProps {
    username: string;
    message: string;
    date: string;
    likeCount: number;
    onLikeClick: () => void;
    onDeleteClick: () => void;
}

// ?? Is it good practice like in html to specify w and h

export default function Message({ username, message, date, likeCount, onLikeClick, onDeleteClick }: MessageProps) {
    return (
        <div className="grid gap-2 p-5 bg-white border-2 rounded-md border-light-grey">
            <div className="flex justify-between">
                <p className="font-medium">{username}</p>
                <p className="text-grey">{date}</p>
            </div>

            <p>{message}</p>

            <div className="flex justify-between pt-2 gap-4 border-t-2 border-light-grey">
                <div className="flex gap-2">
                    <button id="like-btn" type="button" onClick={onLikeClick} aria-labelledby="likeSpan">
                        <img src="https://placehold.co/20x20" alt="Like" width={20} height={20}/>
                    </button>
                    <span id="likeSpan">{likeCount}</span>

                    <button id="reply-btn" type="button" aria-labelledby="replySpan">
                        <img src="https://placehold.co/20x20" alt="" aria-hidden="true" width={20} height={20} />
                    </button>
                    <span id="replySpan">Reply</span>
                </div>

                <div className="flex gap-2">
                    <button id="reply-btn" type="button" onClick={onDeleteClick}>
                        <img src="https://placehold.co/20x20" alt="Delete" width={20} height={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}