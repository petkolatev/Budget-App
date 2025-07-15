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
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
            setMsg('Successful login');
            localStorage.setItem('token', data.token);
            router.push('/')
        } else {
            setMsg(` ${data.error}`);
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
