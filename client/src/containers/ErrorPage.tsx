import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom"

export function ErrorPage () {
    const error  = useRouteError();

    // We use a React router built-in type guard to avoid type error on const
    if (isRouteErrorResponse(error)) {
        return (
            <section aria-labelledby="error-heading" className="flex-1 flex flex-col justify-center items-center gap-3">
                <h1 
                    id="error-heading" 
                    className="font-semibold text-3xl text-gray-900"
                >
                    Unexpected error!
                </h1>
                <span>{`${error.status} ${error.statusText}`}</span>

                <Link 
                    to={"auth/login"} 
                    aria-label="Continue to login"
                    className="underline text-blue-600 hover:text-blue-800"
                >
                    Redirection to login
                </Link>
            </section>
        )
    }
}