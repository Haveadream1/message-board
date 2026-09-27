import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="pb-5 flex items-center justify-between border-b-2 border-b-light-grey">
            <p className="text-blue text-lg font-medium">Message board</p>

            <Link to={"/auth/login"} aria-label="Continue to login">
                Profile
            </Link>
        </header>
    )
}