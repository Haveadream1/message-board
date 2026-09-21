import React, { useEffect } from "react";
import { useMessage } from "../context/MessageContext";

export default function Form () {
    const {messageFormData, handleDataChange, cleanForm} = useMessage();

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!messageFormData.username || !messageFormData.message) {
            console.log("Alert: empty inputs");
            return;
        }
        console.log("Success submit !");
        cleanForm();
    }

    useEffect(() => {
        console.log(messageFormData);
    })

    /* 
        When input change update the state value
        On submit verify that both inputs are not empty
        If not then values    
    */

    return (
        <>
            <form id="message-form" onSubmit={handleSubmit} className="bg-white p-5 border-2 border-light-grey rounded-md flex flex-col gap-2">
                <label htmlFor="username-input">Username</label>
                <input 
                    id="username-input"
                    value={messageFormData.username}
                    onInput={(e) => handleDataChange("username", e.currentTarget.value)} 
                    type="text"
                    placeholder="Your username (e.g Haveadream)"
                    className="bg-violet p-1.5 border-2 border-light-grey rounded-md"
                />

                <label htmlFor="message-input">Message</label>
                <textarea 
                    id="message-input"
                    value={messageFormData.message}
                    onInput={(e) => handleDataChange("message", e.currentTarget.value)} 
                    rows={4} 
                    placeholder="Your message" 
                    className="bg-violet p-1.5 border-2 border-light-grey rounded-md" 
                />

                <button type="submit" className="bg-blue mt-5 pt-1 pr-8 pb-1 pl-8 ml-auto text-white rounded-md">Post message</button>
            </form>
        </>
    )
}
// * need an action, if we handle with backend
// ? Need to create a input/label component ?