/* Provider */
import { MessageProvider} from "./context/MessageContext";
import { AuthProvider } from "./context/AuthContext";

/* Page */
import { HomePage } from "./containers/HomePage";
import AuthForm from "./containers/AuthForm";

/* Utils */
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./containers/ErrorPage";

function RootLayout () {
    return (
        <>
            <AuthProvider>
                <MessageProvider>
                    <Outlet />
                </MessageProvider>
            </AuthProvider>
        </>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />, // Providers wrap all children now
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "/auth/login", element: <AuthForm /> }
        ]
    },
])

export default function App() {
    return (
        <>
            <Toaster/>
            <RouterProvider router={router} />
        </>
    )
}
