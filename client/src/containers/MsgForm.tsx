import React, { useState } from "react";
import { useMessage } from "../context/MessageContext";
import { MsgInput } from "../components/MsgInput";import toast from "react-hot-toast";
import { Button } from "../components/ui/Buttons";

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
                    <Button
                        type="submit" 
                        form="message-form"
                        disabled={isSubmitting}
                        color="blue"
                        padding="wider"
                        disabledStyle={true}
                        focusStyle={true}
                    >
                        { isSubmitting ? "Posting..." : "Post message" }
                    </Button>

                    {!isSubmitting && (
                        <Button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            color="red"
                            padding="wider"
                            disabledStyle={true}
                            focusStyle={true}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </>
    )
}

// Form is hidden directly after submit but to avoid error, disable button on submit