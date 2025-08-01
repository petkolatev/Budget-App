import React, { useState } from 'react';
import styles from '../styles/Login.module.css'
import { useRouter } from 'next/router';

export default function signUp() {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [error, setError] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== rePassword) {
            return setError('Passwords mismatch')
        }
        const res = await fetch('/api/signUp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, rePassword }),
        });
        const data = await res.json();
        if (res.ok) {
            router.push('/login')
        } else {
            setError(` ${data.error}`);
        }


    }
    return (
        <div className={styles.login}>
            <h2>Sign Up</h2>
            <form onSubmit={handleCreate}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <input type="password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} placeholder="RePassword" />
                <button type="submit">Submit</button>
                {error && <p className={styles.msg}>{error}</p>}
            </form>
        </div>
    )
}