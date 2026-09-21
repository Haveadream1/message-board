import { useState } from "react";
import { Aside } from "../components/Aside";
import Message from "../components/Message";
import { useMessage } from "../context/MessageContext";
import Form from "./Form";

export default function HomePage() {
    const [isFormEnable, setIsFormEnable] = useState(false);
    const { messages } = useMessage();

    return (
        <main className="pt-5 flex flex-col gap-5 sm:grid grid-cols-[1fr_3fr]">
            <Aside onOpenForm={() => setIsFormEnable(true)} />
            <div id="message-container" className="flex flex-col gap-5">
                {messages.map((message) =>
                    <Message 
                        key={message.id}
                        username={message.username}
                        message={message.message}
                    />
                )}
                
                {isFormEnable && (
                    <Form onOpenForm={() => setIsFormEnable(false)} />
                )}
            </div>
        </main>
    )
}