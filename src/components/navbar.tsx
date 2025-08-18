import Link from "next/link";
import { useSession } from "next-auth/react";


export default function Navbar() {
    const { data: session, status } = useSession()

    return (
        <nav className="navbar">
            <Link href='/'>Home</Link>
            {status === 'unauthenticated' && (
                <>
                    <Link href='/login'>Login</Link>
                    <Link href='/signUp'>Sign Up</Link>
                </>

            )}
            {status === 'authenticated' && (
                <>
                    <Link href='/createCategory'>Category</Link>
                </>
            )}
        </nav>

    )
}