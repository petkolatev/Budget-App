"use client";

import { SessionProvider } from "next-auth/react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import "@/styles/globals.css";
import Navbar from "../components/Navbar";
import { CategoryProvider } from "../context/CategoryContext";
import { ToastProvider } from "../context/ToastContext";
import { BudgetProvider } from "../context/BudgetContext";
import Preloader from "./dashboard/Preloader";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="bg">
            <body>
                <SessionProvider>
                    <ToastProvider>
                        <CategoryProvider>
                            <BudgetProvider>
                                <Navbar />
                                <Preloader />
                                {children}
                            </BudgetProvider>
                        </CategoryProvider>
                    </ToastProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
