import type React from "react";
import { AuthButton } from "../components/AuthButton";
import { AuthInput } from "../components/AuthInput";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function AuthForm () {
    const [isLogin, setIsLogin] = useState(false); // UX conv-> default on login as returning users is more common than new users
    const [isSubmitting, setIsSubmitting] = useState(false); // To disable button onSubmit
    const {login, register, formData, cleanFormData, handleDataChange} = useAuth();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
    
        if(!formData.username.trim() || !formData.password.trim()) return;
        setIsSubmitting(true);

        try {
            if (isLogin) {
                await login(formData.username, formData.password);
            } else {
                await register(formData.username, formData.password);
            }
            cleanFormData();
        } catch (error) {
            // Error is already handled by toast in context
            console.error("Auth error: ", error);
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-8 rounded-md bg-white shadow-lg">
            {/* Left column -> image and back button */}
            <div className="w-full h-full rounded-md relative overflow-hidden hidden md:block">
                <button 
                    type="button"
                    className="absolute top-4 left-4 rounded-full bg-white/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium hover:bg-white/80 transition"
                    >
                        ← Go back to website
                </button>
                <img 
                    src="https://placehold.co/350x350"
                    alt="Landscape" 
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Right column -> form */}
            <section aria-labelledby="auth-heading" className="flex flex-col gap-4 px-4 py-6 md:px-10">
                <h1 id="auth-heading" className="font-semibold text-3xl text-gray-900">
                    {isLogin ? "Welcome back!" : "Create an account"}
                </h1>

                <div className="flex gap-2 items-center">
                    <p className="text-gray-600">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    <button 
                        type="button"
                        onClick={() => setIsLogin(!isLogin)} // Toggle between state 
                        className="underline text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                        {isLogin ? "Register" : "Log in"}
                    </button>
                </div>

                <form id="auth-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                    <AuthInput 
                        id="username-input"
                        label="Username"
                        name="username"
                        value={formData.username}
                        autoComplete="username" 
                        disabled={isSubmitting}
                        onChange={(e) => handleDataChange("username", e.currentTarget.value)}
                    />
                    <AuthInput 
                        id="password-input"
                        label="Password"
                        name="password"
                        value={formData.password}
                        autoComplete="new-password" 
                        disabled={isSubmitting}
                        onChange={(e) => handleDataChange("password", e.currentTarget.value)}
                    />
                    {!isLogin && (
                        <AuthInput 
                            isInputCheckbox={true}
                            id="terms-checkbox"
                            name="terms-and-conditions"
                            disabled={isSubmitting}
                        />
                    )}

                    <button 
                        type="submit"
                        form="auth-form"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white rounded-md p-3 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        { isSubmitting ? (
                            "Submitting..."
                        ):(
                            isLogin ? "Log in" : "Create account"
                        )}
                    </button>
                </form>

                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            {isLogin ? "Or log in with" : "Or register with" }
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Can do a map with an array, but might add logo so img src later */}
                    <AuthButton 
                        name="Github"
                    />
                    <AuthButton 
                        name="Kakao"
                    />
                    <AuthButton 
                        name="Line"
                    />
                    <AuthButton 
                        name="Wechat"
                    />
                    <AuthButton 
                        name="Google"
                    />
                </div>
            </section>
        </div>
    );
}

// TODO: define terms and conditions
// ?? Keep required on inputs if we create validation or keep it like that

// grid-cols-1 md:grid-cols-2
    // Define one column and when space, takes two
// px-4 py-1.5 
    // padding-inline (left and right) padding-block (top and bottom)
    // we can specify reading side
// md: / sm:
    // Media query for medium/small size screens
// focus:ring-2
    // Create shadowed outline
// autocomplete: "new-password" for register; "current-password" for login
// group
    // Defined in the parent and then user group-hover on the child to apply the same style at the same moment
// disabled:opacity-50 disabled:cursor-not-allowed
    // target when submit button is disabled
// inset
    // set the distance between an el and the parent el

// aria-label for button with redirection 
// outline none on focus, and then display ring