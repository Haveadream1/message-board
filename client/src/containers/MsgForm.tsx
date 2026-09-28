import React, { useState } from "react";
import { useMessage } from "../context/MessageContext";
import { MsgInput } from "../components/MsgInput";import toast from "react-hot-toast";

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
        if (!formData.trim()) {
            toast.error("Message cannot be empty");
            return;
        };
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
            <form 
                id="message-form"
                onSubmit={handleSubmit}
                className="bg-white p-5 border-2 border-light-grey rounded-md flex flex-col gap-4"
            >
                <MsgInput 
                    id="username-input"
                    label="Message"
                    isInputEmpty={!formData.trim()}
                    errorText="*Message cannot be empty" 
                    value={formData}
                    disabled={isSubmitting}
                    onChange={(e) => setFormData(e.currentTarget.value)}
                />

                <div className="flex justify-end gap-5">
                    <button 
                        type="submit" 
                        form="message-form"
                        className="rounded-md text-white bg-blue-600 hover:bg-blue-700 font-medium px-7 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:cursor-not-allowed disabled:opacity-50" 
                        disabled={isSubmitting}
                    >
                        { isSubmitting ? "Posting..." : "Post message" }
                    </button>

                    {!isSubmitting && (
                        <button 
                            type="button"
                            onClick={onCancel}
                            className="rounded-md text-white bg-red-600 hover:bg-red-700 font-medium px-7 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </>
    )
}

// Form is hidden directly after submit but to avoid error, disable button on submit