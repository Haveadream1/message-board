interface AsideProps {
    onOpenForm: () => void;
    disabled: boolean;
}

export function Aside({ onOpenForm, disabled }: AsideProps) {
    return (
        <aside>
            <h1 className="pb-5 text-2xl text-gray-900">Conversations & Threads</h1>
            <p className="pb-5">
                A simple and reliable way to engage in conversations from your 
                favorite topic to the discovery of something new. 
                <br />
                Try now !
            </p>
            <button 
                type="button" 
                onClick={onOpenForm} 
                className="w-full rounded-md text-white bg-blue-600 hover:bg-blue-700 font-medium p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled::opacitiy-50 disabled:cursor-not-allowed"
                disabled={disabled}
            >
                Add message
            </button>
        </aside>
    )
}