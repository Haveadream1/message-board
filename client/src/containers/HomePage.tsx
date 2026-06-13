import { Aside } from "../components/Aside";
import Message from "../components/Message";

export default function HomePage() {
    return (
        <div className="flex items-center">
            <Aside />
            <div id="message-container">
                <Message />
            </div>
        </div>
    )
}