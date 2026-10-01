import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: "blue" | "purple" | "red";
    padding?: "even" | "wide" | "wider";
    textColor?: "white" | "blue";
    disabledStyle?: boolean;
    focusStyle?: boolean;
}

// Component library to enable shared style
export function Button({ color, padding, textColor="white", 
    disabledStyle, focusStyle, children, className, ...props 
}: ButtonProps) {
    return (
        <button
            className={clsx(
                // Base style
                "rounded-md font-medium",

                // Main Color variant
                {
                    "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" : color === "blue",
                    "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500": color === "purple",
                    "bg-red-600 hover:bg-red-700 focus:ring-red-500": color === "red"
                },
                
                // Padding variant
                {
                    "p-3": padding === "even",
                    "px-4 py-2": padding === "wide",
                    "px-7 py-2": padding === "wider",
                },

                // TextColor variant
                {
                    "text-white": textColor === "white",
                    "text-blue-600": textColor === "blue",
                },

                // Disabled style
                disabledStyle && "disabled:opacity-50 disabled:cursor-not-allowed",

                // Foucs style
                focusStyle && "focus:outline-none focus:ring-2 focus:ring-offset-2 transition",

                // Allow the override for additional style
                className 
            )}
            {...props}
        >
            {children}
        </button>
    )
}
