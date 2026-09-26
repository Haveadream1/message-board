export default function AuthForm () {
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
                    Create an account
                </h1>

                <div className="flex gap-2 items-center">
                    <p className="text-gray-600">Already have an account?</p>
                    <button 
                        type="button"
                        className="underline text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                        Log in
                    </button>
                </div>

                <form id="auth-form" className="flex flex-col gap-4 mt-2">
                    <label htmlFor="username-input" className="sr-only">
                        Username
                    </label>
                    <input 
                        type="text"
                        name="username"
                        id="username-input"
                        placeholder="Username"
                        autoComplete="username" 
                        className="bg-gray-100 p-3 rounded-md border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                        required
                    />

                    <label htmlFor="password-input" className="sr-only">
                        Password
                    </label>
                    <input 
                        type="text"
                        name="password"
                        id="password-input"
                        placeholder="Password"
                        autoComplete="new-password" 
                        className="bg-gray-100 p-3 rounded-md border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                        required
                    />

                    <label htmlFor="terms-checkbox" className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            id="terms-checkbox"
                            name="terms"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            required
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-800 transition">
                            I agree to the <a href="/terms" className="underline text-blue-600 hover:text-blue-800">terms and conditions</a>
                        </span>
                    </label>

                    <button 
                        type="submit"
                        form="auth-form"
                        className="bg-blue-600 text-white rounded-md p-3 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create account
                    </button>
                </form>

                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or register with</span>
                    </div>
                </div>

                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <button
                        type="button"
                        aria-label="Continue with Github"
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                        Github
                    </button>
                    <button
                        type="button"
                        aria-label="Continue with Kakao"
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                        Kakao
                    </button>
                    <button
                        type="button"
                        aria-label="Continue with Line"
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                        Line
                    </button>
                    <button
                        type="button"
                        aria-label="Continue with WeChat"
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                        WeChat
                    </button>
                    <button
                        type="button"
                        aria-label="Continue with Google"
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                        Google
                    </button>
                </div>
            </section>
        </div>
    );
}

// TODO: define terms and conditions
// TODO: create components, clean
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