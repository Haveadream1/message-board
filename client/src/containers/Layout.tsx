// TS: type annotation with children parameter
export default function Layout({ children } : { children: React.ReactNode}) {
    return (
        <div className="p-5 min-h-screen grid grid-rows-[1fr_8fr] bg-light-violet">
            {children}
        </div>
    )
}