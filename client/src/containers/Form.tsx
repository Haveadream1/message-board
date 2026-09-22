import React, { useEffect } from "react";
import { useMessage } from "../context/MessageContext";
import { Input } from "../components/Input";

interface AsideProps {
    onOpenForm: () => void;
}

export default function Form ({ onOpenForm }: AsideProps) {
    const {formData, handleDataChange, messages, storeMessages,  cleanForm} = useMessage();

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        // Form validation
        if (!formData.username.trim() || !formData.message.trim()) {
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
                <Input
                    id= "username-input"
                    type= "text"
                    label= "Username"
                    isInputEmpty= {!formData.username.trim()}
                    errorText= "*Username cannot be empty"
                    formData= {formData}
                    handleInput= {handleDataChange}
                    placeholder= "Your username (e.g Haveadream)"
                />

                <Input
                    id= "message-input"
                    type= "textarea"
                    label= "Message"
                    isInputEmpty= {!formData.message.trim()}
                    errorText= "*Message cannot be empty"
                    formData= {formData}
                    handleInput= {handleDataChange}
                    placeholder= "Your message" 
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