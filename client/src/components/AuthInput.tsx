import { Link } from "react-router-dom";

interface InputProps {
    id: string;
    label?: string;
    name: string;
    value?: string;
    autoComplete?: string;
    isInputCheckbox?: boolean;
    disabled: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AuthInput ({id, label, name, value, autoComplete, isInputCheckbox, disabled, onChange}: InputProps) {
    return (
        <>
            {isInputCheckbox ? (
                <label htmlFor={id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                        type="checkbox" 
                        id={id}
                        data-testid={id}
                        name={name}
                        disabled={disabled}
                        className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        required
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-800 transition">
                        {`I agree to the `} {/* To space it correctly */}
                        <Link 
                            to={"/terms"}
                            aria-label="Continue to terms and conditions page"
                            className="underline text-blue-600 hover:text-blue-800"
                        >
                            terms and conditions
                        </Link>
                    </span>
                </label>
            ): (
                <>
                    <label htmlFor={id} className="sr-only">
                        {label}
                    </label>
                    <input 
                        type={name === "username" ? "text": "password"}
                        id={id}
                        name={name}
                        value={value}
                        placeholder={label}
                        autoComplete={autoComplete}
                        disabled={disabled}
                        className="bg-gray-100 p-3 rounded-md border border-transparent
                            focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2
                            focus:ring-blue-500/20 transition
                        "
                        required
                        onChange={onChange}
                    />
                </>
            )}
        </>
    )
}