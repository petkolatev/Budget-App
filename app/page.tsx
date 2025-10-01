"use client";

import { useSession } from "next-auth/react";
import { useDataContext } from "@/context/CategoryContext";
import { useToast } from "@/context/ToastContext";
import { useEffect } from "react";
import Dashboard from "@/components/Dashboard";

export default function HomePage() {
    const { data: session, status } = useSession();
    const { error } = useDataContext();
    const { showToast } = useToast();

    useEffect(() => {
        if (error) {
            showToast(error, "error");
        }
    }, [error, showToast]);

    if (status === "loading") return null;
    if (!session) return null;

    return (
        <div className="App">
            <Dashboard />
        </div>
    );
}
