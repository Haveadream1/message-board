import { Button } from "./ui/Buttons";

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

            <Button
                type="button" 
                onClick={onOpenForm} 
                disabled={disabled}
                className="w-full"
                color="blue"
                padding="even"
                disabledStyle={true}
                focusStyle={true}
            >
                Add Message
            </Button>
        </aside>
    )
}