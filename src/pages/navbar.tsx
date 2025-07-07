import Link from "next/link";
import styles from '../styles/Nav.module.css'

export default function Navbar() {
    return (
            <nav className="navbar">
                <Link href='/'>Home</Link>
                <Link href='/login'>Login</Link>
            </nav>
       
    )
}