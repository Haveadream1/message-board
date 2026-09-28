import Header from "../components/Header";
import Main from "./Main";

// To keep everything clean for the router
export function HomePage () {
    return (
        <>
            <Header
                isLoginDisplay={false}
            />
            <Main/>
        </>
    )
}