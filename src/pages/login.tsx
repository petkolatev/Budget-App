import { signIn } from 'next-auth/react'
import { useState } from 'react';
import styles from '../styles/Login.module.css'
import { useRouter } from 'next/router';

export default function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg('')
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        })

        if (res?.ok) {
            router.push('/')
        } else {
            setMsg('Wrong email or password')
        }
    };

    return (
        <div className={styles.login}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Login</button>
                {msg && <p className={styles.msg}>{msg}</p>}
            </form>
        </div>
    );
}
