import { Link } from "react-router-dom";

export function TermsPage () {
    return (
        <section aria-labelledby="terms-heading" className="flex-1 flex flex-col gap-3">
            <h1 
                id="terms-heading" 
                className="font-semibold text-3xl text-gray-900 text-center"
            >
                Terms and Conditions
            </h1>
            <p className="text-center pb-6">Last update: {new Date().toLocaleDateString()}</p>
            
            <div className="flex-1 flex flex-col gap-3">
                <p>
                    By using this website you agree to use it responsibly, <br />
                    not abuse the service, and accept that this is a demo project <br />
                    provided as-it without warranty.
                </p>
                <p>
                    Your data is hashed and stored in database for demonstration purposes only.
                </p>
                
                <Link 
                        to={"/auth/login"} 
                        aria-label="Continue to registration"
                        className="underline text-blue-600 hover:text-blue-800"
                    >
                        Going back to registration
                </Link>
            </div>
        </section>
    )
}