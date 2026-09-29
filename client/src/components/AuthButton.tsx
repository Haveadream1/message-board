export function AuthButton ({name}: {name: string}) {
    return (
        <>
            <button
                type="button"
                aria-label={`Continue with ${name}`}
                className="flex items-center justify-center 
                    gap-2 py-2 px-4 rounded-md border
                    border-gray-200 text-sm font-medium
                    text-gray-700 hover:bg-gray-50 transition
                "
            >
                {name}
            </button>
        </>
    )
}

// Prepared for the external auth but not used right now, as the style might be refactored keep it outside ui comp