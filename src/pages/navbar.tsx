import { AppProps } from "next/app";
import Link from "next/link";

export default function Navbar({ pageProps }: AppProps) {
    
    return (
        <nav className="navbar">
            <Link href='/'>Home</Link>
            <Link href='/login'>Login</Link>
            <Link href='/signUp'>Sign Up</Link>
            <Link href='/createCategory'>Category</Link>
        </nav>

    )
}