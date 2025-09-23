import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Preloader from "./Preloader";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <nav className="navbar" style={{ position: "relative" }}>
      <div className="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
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
            <Link href="/extendedBudget">Budget</Link>
            <Link href="/categories">Category</Link>
            <Link href="/userProfile">{session.user?.name}</Link>
            <button
              onClick={() => {
                signOut({ callbackUrl: "/login" });
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>

      {loading && <Preloader />} { }
    </nav>
  );
}
