import type React from "react";

interface InputProps {
    id: string;
    label: string;
    isInputEmpty: boolean;
    errorText?: string;
    value: string;
    placeholder?: string;
    disabled: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MsgInput({ id, label, isInputEmpty, errorText, value, placeholder, disabled, onChange }: InputProps) {
    return (
        <>
            <div className="flex gap-4 items-baseline">
                <label htmlFor={id}>{label}</label>
                { isInputEmpty && (
                    <small className="text-red">{errorText}</small>
                )}
            </div>

            <textarea 
                id={id}
                value={value}
                rows={4} 
                placeholder={placeholder}
                className="bg-violet p-1.5 border-2 border-light-grey rounded-md" 
                disabled={disabled}
                onChange={onChange}
            />
        </>
    )
};