interface MessageProps {
    username: string;
    message: string;
    date: string;
}

export default function Message({ username, message, date }: MessageProps) {
    return (
        <div className="p-5 bg-white border-2 rounded-md border-light-grey">
            <div className="flex justify-between">
                <p className="font-medium">{username}</p>
                <p className="text-grey">{date}</p>
            </div>
            <p>{message}</p>
        </div>
    )
}