import { SessionProvider } from "next-auth/react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/navbar";
import { CategoryProvider } from "@/context/CategoryContext";
import { ToastProvider } from "@/context/ToastContext";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <ToastProvider>
                <CategoryProvider>
                    <Navbar />
                    <Component {...pageProps} />
                </CategoryProvider>
            </ToastProvider>
        </SessionProvider>
    );
}
