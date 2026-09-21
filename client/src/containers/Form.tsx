export default function Form () {
    const handleSubmit = (e) => {
        e.preventDefault();

        const username = document.querySelector("#username-input");
        const message = document.querySelector("#message-input");
        
        console.log(username, message);
    }

    return (
        <>
            <form id="message-form" onSubmit={handleSubmit} className="bg-white p-5 border-2 border-light-grey rounded-md flex flex-col gap-2">
                <label htmlFor="username-input">Username</label>
                <input id="username-input" type="text" placeholder="Your username (e.g Haveadream)" className="bg-violet p-1.5 border-2 border-light-grey rounded-md" />

                <label htmlFor="message-input">Message</label>
                <textarea id="message-input" rows={4} placeholder="Your message" className="bg-violet p-1.5 border-2 border-light-grey rounded-md" />

                <button type="submit" className="bg-blue mt-5 pt-1 pr-8 pb-1 pl-8 ml-auto text-white rounded-md">Post message</button>
            </form>
        </>
    )
}
// * need an action, if we handle with backend
// ? Need to create a input/label component ?