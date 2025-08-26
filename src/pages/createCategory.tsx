import { useDataContext } from '@/context/CategoryContext';
import styles from '../styles/Category.module.css'
import { useState, FormEvent } from 'react';


export default function CreateCategoryPage() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [createCategory, setCreateCategory] = useState(false)
    const [name, setName] = useState<string>('');
    const [merchantName, setMerchantName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const { categories, reloadCategories } = useDataContext()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/createCategories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                merchantName,
                description
            }),
        });

        const data = await res.json();
        if (data.success) {
            setMessage(data.message);
            setName('');
            setMerchantName('');
            setDescription('')
            reloadCategories()
            setCreateCategory(false)
        } else {
            setMessage(`Error: ${data.error}`);
        }
    };

    const handleDelete = async (categoryName: string, merchantName: string) => {
        const deletedItem = merchantName ? merchantName : categoryName
        const confirmed = window.confirm(`Are you sure you want to delete ${deletedItem} ?`)

        if (!confirmed) return

        const res = await fetch('/api/deleteMerchant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                categoryName,
                merchantName,
            }),
        });

        if (res.status === 200) {
            reloadCategories()
        }


    }

    return (
        <div>
            <div className={styles.category}>
                <button onClick={() => setCreateCategory(!createCategory)}>Добави категория</button>
                {createCategory ?
                    <div className={styles.category}>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Име на категория:
                                <input value={name} onChange={e => setName(e.target.value)} required />
                            </label>
                            <button type="submit">Създай</button>
                        </form>
                        {message && <p className={styles.msg}>{message}</p>}
                    </div>
                    : ''
                }
            </div>
            <div className={styles.category}>
                <h1>Категории и търговци</h1>
                <div className={styles.deleteCategory}>
                    {categories.map((group, categoryIndex) => {
                        const [categoryName, ...merchants] = group;

                        return (
                            <div key={categoryName} className={styles.categoryName}>

                                <h2>{categoryName} <button onClick={() => handleDelete(categoryName, merchantName)}>
                                    X
                                </button></h2>

                                <button className={styles.addMerchant}
                                    onClick={() => {
                                        setActiveCategory(prev => (prev === categoryName ? null : categoryName))
                                        if (!activeCategory) {
                                            setName(categoryName)
                                        } else {
                                            setName('')
                                        }
                                    }
                                    }
                                >Добави търговец</button>
                                {activeCategory === categoryName && (
                                    <form onSubmit={handleSubmit}>
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
                                    </form>
                                )}

                                <ul>
                                    {merchants.map((merchant, merchantIndex) => (
                                        <li key={merchant}>
                                            <span>{merchant}</span>

                                            <button
                                                onClick={() => handleDelete(categoryName, merchant)}
                                            >
                                                X
                                            </button>

                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
