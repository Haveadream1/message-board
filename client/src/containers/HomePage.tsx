import Header from "../components/Header";
import Main from "./Main";

// To keep everything clean for the router
export function Homepage () {
    return (
        <>
            <Header
                isLoginDisplay={true}
            />
            <Main/>
        </>
    )
}