interface MessageProps {
    username: string;
    message: string;
}

export default function Message({ username, message }: MessageProps) {
    return (
        <div className="p-5 bg-white border-2 rounded-md border-light-grey">
            <div className="flex justify-between">
                <p className="font-medium">{username}</p>
                <p className="text-grey">2026/06/12</p>
            </div>
            <p>{message}</p>
        </div>
    )
}