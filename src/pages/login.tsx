import { signIn } from 'next-auth/react'
import { useState } from 'react';
import styles from '../styles/Login.module.css'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

export default function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { showToast } = useToast()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        })

        if (res?.ok) {
            router.push('/dashboard')
        } else {
            showToast('Wrong email or password', 'error')
        }
    };

    return (
        <div className={styles.login}>
            <div className='icon'>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="24" fill="#4CAF50" />
                    <rect x="12" y="28" width="5" height="10" fill="white" />
                    <rect x="21" y="20" width="5" height="18" fill="white" />
                    <rect x="30" y="14" width="5" height="24" fill="white" />
                </svg>
                <b>BUDGET</b>
            </div>
            <div className={styles.form}>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className={styles.inputContainer}>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </div>
                    <button type="submit">Login</button>
                    <span>Don't have an account? <Link href='/signUp'>Sign Up</Link></span>
                </form>
            </div>
        </div>
    );
}
