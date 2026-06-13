import { Aside } from "../components/Aside";
import Message from "../components/Message";

export default function HomePage() {
    return (
        <main className="grid grid-cols-[1fr_3fr]">
            <Aside />
            <div id="message-container">
                <Message />
            </div>
        </main>
    )
}