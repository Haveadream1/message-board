interface FormData {
    username: string;
    message: string;
}

interface InputProps {
    id: string;
    type: "text" | "textarea"; // Restrict to only those 2 values
    label: string;
    isInputEmpty: boolean;
    errorText?: string;
    formData: FormData;
    handleInput: (label: "username" | "message", value: string) => void;
    placeholder: string;
}

export function MsgInput({ id, type, label,isInputEmpty, errorText, formData, handleInput, placeholder }: InputProps) {
    return (
        <>
            <div className="flex gap-4 items-baseline">
                <label htmlFor={id}>{label}</label>
                { isInputEmpty && (
                    <small className="text-red">{errorText}</small>
                )}
            </div>

            {type === "text" ? (
                <input 
                    id={id}
                    value={formData.username}
                    onInput={(e) => handleInput("username", e.currentTarget.value)} 
                    type="text"
                    placeholder={placeholder}
                    className="bg-violet p-1.5 border-2 border-light-grey rounded-md"
                />   
            ) : (
                <textarea 
                    id={id}
                    value={formData.message}
                    onInput={(e) => handleInput("message", e.currentTarget.value)} 
                    rows={4} 
                    placeholder={placeholder}
                    className="bg-violet p-1.5 border-2 border-light-grey rounded-md" 
                />
            )}
        </>
    )
};