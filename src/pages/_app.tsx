import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/navbar";
import { CategoryProvider } from "@/context/CategoryContext";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <CategoryProvider>
                <Navbar />
                <Component {...pageProps} />
            </CategoryProvider>
        </SessionProvider>
    );
}
