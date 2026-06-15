import { Aside } from "../components/Aside";
import Message from "../components/Message";

export default function HomePage() {
    return (
        <main className="pt-5 grid grid-cols-[1fr_3fr] gap-5">
            <Aside />
            <div id="message-container" className="flex flex-col gap-5">
                <Message />
                <Message />
            </div>
        </main>
    )
}