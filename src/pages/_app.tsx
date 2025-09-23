import { SessionProvider } from "next-auth/react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import { CategoryProvider } from "@/context/CategoryContext";
import { ToastProvider } from "@/context/ToastContext";
import { useEffect, useState } from "react";
import Preloader from "@/components/Preloader";
import { BudgetProvider } from "@/context/BudgetContext";

export default function App({ Component, pageProps }: AppProps) {
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, [])

    if (loading) return <Preloader />

    return (
        <SessionProvider session={pageProps.session}>
            <ToastProvider>
                <CategoryProvider>
                    <BudgetProvider>
                        <Navbar />
                        <Component {...pageProps} />
                    </BudgetProvider>
                </CategoryProvider>
            </ToastProvider>
        </SessionProvider>
    );
}
