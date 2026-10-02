import type React from "react";

interface InputProps {
    id: string;
    label: string;
    isInputEmpty: boolean;
    errorText?: string;
    value: string;
    placeholder?: string;
    disabled: boolean;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function MsgInput({ id, label, isInputEmpty, errorText, value, placeholder, disabled, onChange }: InputProps) {
    return (
        <>
            <div className="flex gap-5 items-baseline">
                <label 
                    htmlFor={id}
                    className="text-xl"
                >
                    {label}
                </label>
                { isInputEmpty && (
                    <small className="text-red-600 font-medium">{errorText}</small>
                )}
            </div>

            <textarea 
                id={id}
                value={value}
                rows={4} 
                placeholder={placeholder}
                className="bg-gray-100 p-3 rounded-md border border-transparent
                    focus:border-blue-500 focus:bg-white focus:outline-none 
                    focus:ring-2 focus:ring-blue-500/20 transition
                "
                disabled={disabled}
                onChange={onChange}
            />
        </>
    )
};