import { Link } from "react-router-dom";

export default function Header({isLoginDisplay} : { isLoginDisplay: boolean}) {
    return (
        <header className="pb-5 flex items-center justify-between border-b-2 border-b-light-grey">
            <p className="text-blue text-lg font-medium">Message board</p>

            {isLoginDisplay ? (
                <Link to={"/auth/login"} aria-label="Continue to login">
                    Login
                </Link>  
            ) : (
                <Link 
                    to={"/"} 
                    aria-label="Continue to homepage"
                    className="block md:hidden"
                    >
                    Homepage
                </Link>  
            )}
        </header>
    )
}