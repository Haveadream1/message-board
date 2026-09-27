interface InputProps {
    id: string;
    label?: string;
    name: string;
    autocomplete?: string;
    isInputCheckbox?: boolean;
}

export function AuthInput ({id, label, name, autocomplete, isInputCheckbox}: InputProps) {
    return (
        <>
            <label htmlFor={id} className="sr-only">
                {label}
            </label>
            <input 
                type="text"
                name={name}
                id={id}
                placeholder={label}
                autoComplete={autocomplete}
                className="bg-gray-100 p-3 rounded-md border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                required
            />

            {isInputCheckbox && (
                <label htmlFor={id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                        type="checkbox" 
                        id={id}
                        name={name}
                        className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        required
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-800 transition">
                        I agree to the <a href="/terms" className="underline text-blue-600 hover:text-blue-800">terms and conditions</a>
                    </span>
                </label>
            )}
        </>
    )
}