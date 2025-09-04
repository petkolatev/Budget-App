import { useDataContext } from '@/context/CategoryContext';
import styles from '../styles/Category.module.css';
import { useState, FormEvent } from 'react';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';

export default function CreateCategoryPage() {
    const [createCategory, setCreateCategory] = useState(false);
    const [showMerchantModal, setShowMerchantModal] = useState(false);
    const [name, setName] = useState<string>('');
    const [merchantName, setMerchantName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const { categories, reloadCategories } = useDataContext();

    const handleCategorySubmit = async (e: FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/createCategories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });

        const data = await res.json();
        if (data.success) {
            setMessage(data.message);
            showToast(data.message, 'success')
            setName('');
            reloadCategories();
            setCreateCategory(false);
        } else {
            showToast(`Error: ${data.error}`, 'error')

        }
    };

    const handleMerchantSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/createMerchants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, merchantName, description }),
        });

        const data = await res.json();
        if (data.success) {
            setMessage(data.message);
            showToast(data.message, 'success')
            setName('')
            setMerchantName('');
            setDescription('');
            setShowMerchantModal(false);
            reloadCategories();
        } else {
            showToast(`Error: ${data.error}`, 'error')

        }
    };

    const handleDeleteCategory = async (categoryName: string) => {
        const confirmed = window.confirm(`Сигурен ли си, че искаш да изтриеш ${categoryName}?`);
        if (!confirmed) return;

        const res = await fetch('/api/deleteCategory', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryName }),
        });

        const data = await res.json();
        if (res.status === 200) {
            showToast(data.message, 'success')
            reloadCategories();
        } else {
            showToast(`Error: ${data.error}`, 'error')

        }


    };

    const deleteAllMerchantsFromCategory = async (categoryName: string) => {
        const confirmed = window.confirm(`Сигурен ли си, че искаш да изтриеш всички търговци от ${categoryName}?`);
        if (!confirmed) return;

        const res = await fetch('/api/deleteAllMerchantsFromCategory', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryName }),
        });

        const data = await res.json()

        if (res.status === 200) {
            showToast(data.message, 'success')
            reloadCategories();
        } else {
            showToast(`Error: ${data.error}`, 'error')

        }

    }

    const handleDeleteMerchant = async (merchantName: string) => {
        const confirmed = window.confirm(`Сигурен ли си, че искаш да изтриеш ${merchantName}?`);
        if (!confirmed) return;

        const res = await fetch('/api/deleteMerchant', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ merchantName }),
        });
        const data = await res.json()

        if (res.status === 200) {
            showToast(data.message, 'success')
            reloadCategories();
        } else {
            showToast(`Error: ${data.error}`, 'error')

        }
    };

    const showToast = (msg: string, type: 'success' | 'error' = 'success', duration = 3000) => {
        setToastMessage({ message: msg, type });
        setTimeout(() => setToastMessage(null), duration);
    };



    return (
        <div>
            <div className={styles.category}>
                <button onClick={() => { setCreateCategory(!createCategory), setName(''), setMessage('') }}>Добави категория</button>
                {createCategory && (
                    <div className={styles.category}>
                        <form onSubmit={handleCategorySubmit}>
                            <label>
                                Име на категория:
                                <input value={name} onChange={e => setName(e.target.value)} required />
                            </label>
                            <button type="submit">Създай</button>
                        </form>
                    </div>
                )}
            </div>

            <div className={styles.category}>
                <h1>Категории и търговци</h1>
                <div className={styles.deleteCategory}>
                    {categories.map(group => {
                        const [categoryName, ...merchants] = group;

                        return (
                            <div key={categoryName} className={styles.categoryName}>
                                <h2>
                                    {categoryName}
                                    <button onClick={() => handleDeleteCategory(categoryName)}>X</button>
                                </h2>

                                <button
                                    className={styles.addMerchant}
                                    onClick={() => {
                                        setName(categoryName);
                                        setShowMerchantModal(true);
                                        setMessage('')
                                    }}
                                >
                                    Добави търговец
                                </button>

                                <ul>
                                    {merchants.map(merchant => (
                                        <li key={merchant}>
                                            <span>{merchant}</span>
                                            <button onClick={() => handleDeleteMerchant(merchant)}>X</button>
                                        </li>

                                    ))}
                                </ul>

                                <button
                                    className={styles.addMerchant}
                                    onClick={() => {
                                        deleteAllMerchantsFromCategory(categoryName)
                                    }}
                                >
                                    Изтрии всички
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Modal isOpen={showMerchantModal} onClose={() => setShowMerchantModal(false)}>
                <form className={styles.PopUp} onSubmit={handleMerchantSubmit}>
                    <label>
                        Име на Търговец:
                        <input
                            value={merchantName}
                            onChange={e => setMerchantName(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Описание:
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                        />
                    </label>
                    <br />
                    <button type="submit">Създай</button>
                    {message && <p className={styles.msg}>{message}</p>}
                </form>
            </Modal>

            {toastMessage && (
                <Toast
                    message={toastMessage.message}
                    type={toastMessage.type}
                    onClose={() => setToastMessage(null)}
                />
            )}


        </div>
    );
}
