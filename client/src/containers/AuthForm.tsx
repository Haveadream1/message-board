import type React from "react";
import { AuthInput } from "../components/AuthInput";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Buttons";

import blueBuildingAvif from "../assets/blue_building.avif";

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

    const handleFormSwitch = () => {
        cleanFormData();
        setIsLogin(!isLogin); // Toggle between state 
    }
    
    return (    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-8 max-w-5xl rounded-md bg-white shadow-lg">
            {/* Left column -> image and back button */}
            <div className="w-full h-full rounded-md relative overflow-hidden hidden md:block">
                <Link
                    to={"/"}
                    onClick={cleanFormData}
                    className="absolute top-4 left-4 rounded-full
                        bg-white/50 backdrop-blur-sm px-4 py-1.5 
                        text-sm font-medium hover:bg-white/80 transition
                    "
                >
                    ← Go back to website
                </Link>
                <img
                    src={blueBuildingAvif}
                    alt="Building opening to the sky" 
                    className="h-full w-full object-cover"
                    width={470}
                    height={500}
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
                    <Button
                        type="button"
                        onClick={handleFormSwitch}
                        className="underline hover:text-blue-800"
                        textColor="blue"
                    >
                        {isLogin ? "Register" : "Log in"}
                    </Button>
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

                    <Button
                        data-testid="auth-submit-btn"
                        type="submit"
                        form="auth-form"
                        disabled={isSubmitting}
                        color="blue"
                        padding="even"
                        disabledStyle={true}
                        focusStyle={true}
                    >
                        { isSubmitting ? (
                            "Submitting..."
                        ):(
                            isLogin ? "Log in" : "Create account"
                        )}
                    </Button>
                </form>
            </section>
        </div>
    );
}