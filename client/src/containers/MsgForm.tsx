import React, { useState } from "react";
import { useMessage } from "../context/MessageContext";
import { MsgInput } from "../components/MsgInput";;

interface AsideProps {
    onOpenForm: () => void;
}

export default function MsgForm ({ onOpenForm }: AsideProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {formData, storeMessages, setFormData} = useMessage();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        // Form validation
            // trim method to avoid false validation with "white-space"
        if (!formData.trim()) return;
        setIsSubmitting(true);

        try {
            storeMessages(formData);

            // Success, clean state and close form
            onOpenForm();
            setFormData("");
        } catch (error) {
            console.error("Message submit error: ", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const onCancel = () => {
        onOpenForm();
        setFormData("");
    }

    return (
        <>
            <form id="message-form" onSubmit={handleSubmit} className="bg-white p-5 border-2 border-light-grey rounded-md flex flex-col gap-2">
                <MsgInput 
                    id="username-input"
                    label="Message"
                    isInputEmpty={!formData.trim()}
                    errorText="*Message cannot be empty" 
                    disabled={isSubmitting}
                    onChange={(e) => setFormData(e.currentTarget.value)}
                />

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