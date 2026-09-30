import AuthForm from "./AuthForm";
import Header from "../components/Header";

export function AuthPage () {
    return (
        <>
            <Header 
                isLoginDisplay={false}
            />
            <div className="flex-1 flex pt-5 justify-center">
                <AuthForm />
            </div>
        </>
    )
}