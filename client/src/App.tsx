/* Providers */
import { MessageProvider} from "./context/MessageContext";
import { AuthProvider } from "./context/AuthContext";

/* Pages */
import { HomePage } from "./containers/HomePage";
import { AuthPage } from "./containers/AuthPage";
import { ErrorPage } from "./containers/ErrorPage";

/* Utils */
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";


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
            { path: "/auth/login", element: <AuthPage /> }
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
