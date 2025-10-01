"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Preloader from "@/app/dashboard/Preloader";

export default function Navbar() {
    const { data: session, status } = useSession();

    return (
        <nav className="navbar" style={{ position: "relative" }}>
            <div className="icon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                >
                    <circle cx="24" cy="24" r="24" fill="#4CAF50" />
                    <rect x="12" y="28" width="5" height="10" fill="white" />
                    <rect x="21" y="20" width="5" height="18" fill="white" />
                    <rect x="30" y="14" width="5" height="24" fill="white" />
                </svg>
                <b>BUDGET</b>
            </div>

            <div className="buttons">
                {status === "authenticated" && (
                    <>
                        <Link href="/">Home</Link>
                        <Link href="/budget">Budget</Link>
                        <Link href="/categories">Category</Link>
                        <button
                            onClick={() => {
                                signOut({ callbackUrl: "/login" });
                            }}
                        >
                            Logout
                        </button>
                        <div>{session.user?.name}</div>
                    </>
                )}
                {status === "loading" && <Preloader />}
            </div>
        </nav>
    );
}
