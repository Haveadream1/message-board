import React from "react";
import { useMessage } from "../context/MessageContext";
import { MsgInput } from "../components/MsgInput";

interface AsideProps {
    onOpenForm: () => void;
}

export default function MsgForm ({ onOpenForm }: AsideProps) {
    const {formData, handleDataChange, storeMessages,  cleanForm} = useMessage();

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        // Form validation
        // trim method to avoid false validation with "white-space"
        if (!formData.username.trim() || !formData.message.trim()) {
            console.log("Alert: empty inputs");
            return;
        }

        storeMessages({
            username: formData.username,
            message: formData.message,
        })

        onOpenForm();
        cleanForm();
    }

    const onCancel = () => {
        onOpenForm();
        cleanForm();
    }

    return (
        <>
            <form id="message-form" onSubmit={handleSubmit} className="bg-white p-5 border-2 border-light-grey rounded-md flex flex-col gap-2">
                <MsgInput
                    id= "username-input"
                    type= "text"
                    label= "Username"
                    isInputEmpty= {!formData.username.trim()}
                    errorText= "*Username cannot be empty"
                    formData= {formData}
                    handleInput= {handleDataChange}
                    placeholder= "Your username (e.g Haveadream)"
                />

                <MsgInput
                    id= "message-input"
                    type= "textarea"
                    label= "Message"
                    isInputEmpty= {!formData.message.trim()}
                    errorText= "*Message cannot be empty"
                    formData= {formData}
                    handleInput= {handleDataChange}
                    placeholder= "Your message" 
                />

                // TODO: ? create component for Msgbutton ?
                <div className="flex justify-end gap-5">
                    <button 
                        type="submit" 
                        form="message-form"
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