import { useState } from 'react';
import styles from '../styles/Login.module.css'

export default function LoginForm() {
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
            setMsg('✅ Успешен вход');
            localStorage.setItem('token', data.token);
        } else {
            setMsg(`❌ ${data.error}`);
        }
    };

    return (
        <div className={styles.login}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Имейл" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Парола" />
                <button type="submit">Вход</button>
                {msg && <p>{msg}</p>}
            </form>
        </div>
    );
}
