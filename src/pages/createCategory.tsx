import styles from '../styles/Login.module.css'
import { useState, FormEvent } from 'react';

export default function CreateCategoryPage() {
    const [name, setName] = useState<string>('');
    const [merchants, setMerchants] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/createCategories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                merchants: merchants.split(',').map(m => m.trim()),
            }),
        });

        const data = await res.json();
        if (data.success) {
            setMessage('The category has been created successfully!');
            setName('');
            setMerchants('');
        } else {
            setMessage(`Error: ${data.error}`);
        }
    };

    return (
        <div className={styles.login}>
            <h1>Създай нова категория</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Име на категория:
                    <input value={name} onChange={e => setName(e.target.value)} required />
                </label>
                <br />
                <label>
                    Търговци (разделени със запетая):
                    <textarea value={merchants} onChange={e => setMerchants(e.target.value)} rows={4} />
                </label>
                <br />
                <button type="submit">Създай</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
