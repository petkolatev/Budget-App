import React, { useState } from 'react';
import styles from '../styles/SignUp.module.css'
import { useRouter } from 'next/router';
import { useToast } from '@/context/ToastContext';

export default function signUp() {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const { showToast } = useToast()

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== rePassword) {
            return showToast('Password miss match', 'error')
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
            return showToast(`Error: ${data.error}`, 'error')
        }


    }
    return (
        <div className={styles.login}>
            <div className={styles.form}>
                <h2>Sign Up</h2>
                <form onSubmit={handleCreate}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    <input type="password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} placeholder="RePassword" />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}