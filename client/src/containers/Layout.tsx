// TS: type annotation with children parameter
export default function Layout({ children } : { children: React.ReactNode}) {
    return (
        <div className="p-5 min-h-screen bg-violet">
            {children}
        </div>
    )
}