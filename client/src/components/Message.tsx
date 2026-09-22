interface MessageProps {
    username: string;
    message: string;
    date: string;
}

// ?? Is it good practice like in html to specify w and h

export default function Message({ username, message, date }: MessageProps) {
    return (
        <div className="grid gap-2 p-5 bg-white border-2 rounded-md border-light-grey">
            <div className="flex justify-between">
                <p className="font-medium">{username}</p>
                <p className="text-grey">{date}</p>
            </div>

            <p>{message}</p>

            <div className="flex pt-2 gap-4 border-t-2 border-light-grey">
                <div className="flex gap-2">
                    <button type="button">
                        <img src="https://placehold.co/20x20" alt="Like" width={20} height={20}/>
                    </button>
                    <span>12</span>
                </div>

                <div className="flex gap-2">
                    <button type="button">
                        <img src="https://placehold.co/20x20" alt="" aria-hidden="true" width={20} height={20} />
                    </button>
                    <span>Reply</span>
                </div>
            </div>
        </div>
    )
}