import React, { useEffect } from "react";
import { useMessage } from "../context/MessageContext";

interface AsideProps {
    onOpenForm: () => void;
}

export default function Form ({ onOpenForm }: AsideProps) {
    const {formData, handleDataChange, messages, storeMessages,  cleanForm} = useMessage();

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        // Form validation
        if (!formData.username || !formData.message) {
            console.log("Alert: empty inputs");
            return;
        }

        storeMessages({
            username: formData.username,
            message: formData.message
        })

        onOpenForm();
        cleanForm();
        console.log("Success submit !");
    }

    const onCancel = () => {
        onOpenForm();
        cleanForm();
    }

    useEffect(() => {
        console.log(formData, messages);
    })

    return (
        <>
            <form id="message-form" onSubmit={handleSubmit} className="bg-white p-5 border-2 border-light-grey rounded-md flex flex-col gap-2">
                <label htmlFor="username-input">Username</label>
                <input 
                    id="username-input"
                    value={formData.username}
                    onInput={(e) => handleDataChange("username", e.currentTarget.value)} 
                    type="text"
                    placeholder="Your username (e.g Haveadream)"
                    className="bg-violet p-1.5 border-2 border-light-grey rounded-md"
                />

                <label htmlFor="message-input">Message</label>
                <textarea 
                    id="message-input"
                    value={formData.message}
                    onInput={(e) => handleDataChange("message", e.currentTarget.value)} 
                    rows={4} 
                    placeholder="Your message" 
                    className="bg-violet p-1.5 border-2 border-light-grey rounded-md" 
                />

                <div className="flex justify-end gap-5">
                    <button 
                        type="submit" 
                        className="bg-blue pt-1 pr-8 pb-1 pl-8 text-white rounded-md" >
                        Post message
                    </button>

                    <button 
                        type="button"
                        onClick={onCancel}
                        className="bg-red pt-1 pr-8 pb-1 pl-8 text-white rounded-md" >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )
}
// * need an action, if we handle with backend
// ? Need to create a input/label component ?