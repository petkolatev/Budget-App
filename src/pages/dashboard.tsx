import { useDataContext } from "@/context/CategoryContext"
import { selectReceived, selectSpend } from "@/lib/budgetSlice"
import { Transaction } from "@/types/types"
import { FormEvent, useEffect, useState } from "react"
import { useFilePicker } from "use-file-picker"
import { parse } from "@/lib/BudgetParser"
import { RenderPieChart } from "@/components/PieChart"
import styles from '../styles/Dashboard.module.css'
import { rbgaColors, hexColors } from '../components/PieChart'
import Modal from "@/components/Modal"
import { useToast } from "@/context/ToastContext"

export default function dashboard() {
    const { categories, reloadCategories } = useDataContext();
    const [state, setState] = useState<Transaction[]>([])
    const [colors, setColors] = useState<string[]>([])
    const spend = selectSpend(state)
    const received = selectReceived(state)
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showMerchantModal, setShowMerchantModal] = useState(false);
    const [name, setName] = useState<string>('');
    const [merchantName, setMerchantName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [openFileSelector, { filesContent }] = useFilePicker({
        readAs: "Text",
        accept: [".txt"]
    });
    const { showToast } = useToast()

    const handleMerchantSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/createMerchants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, merchantName, description }),
        });

        const data = await res.json();
        if (data.success) {
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
    const handleCategorySubmit = async (e: FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/createCategories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });

        const data = await res.json();
        if (data.success) {
            showToast(data.message, 'success')
            setName('');
            reloadCategories();
            setShowCategoryModal(false);
        } else {
            showToast(`Error: ${data.error}`, 'error')

        }
    };

    useEffect(() => {
        if (filesContent[0]?.content) {
            const budget = parse(filesContent[0].content, categories);
            setState(budget)
            setColors(hexColors)

        }

    }, [filesContent, colors])

    return (
        <div>
            <button onClick={() => openFileSelector()}>Избери Файл</button>
            <div className={styles.dashboard}>
                <div className={styles.pieChart}>
                    {state.length !== 0 && (
                        <RenderPieChart
                            transactions={state}
                            spend={spend}
                            received={received}
                            categories={categories}
                        />
                    )}
                </div>
                {state.length !== 0 && (
                    <div className={styles.categories}>
                        <h1>Категории и търговци</h1>
                        <div className={styles.create}>
                            <button
                                onClick={() => {
                                    setShowCategoryModal(true);
                                    setName('');
                                }}
                            >
                                Добави категория
                            </button>

                            <button
                                className={styles.addMerchant}
                                onClick={() => {
                                    setShowMerchantModal(true);

                                }}
                            >
                                Добави търговец
                            </button>
                        </div>
                        {categories.map((group, index) => {
                            const [categoryName, ...merchants] = group;

                            return (
                                <div key={categoryName} className={styles.category}>
                                    <h2>{categoryName}</h2>
                                    <ul className={styles.merchantGroup}>
                                        {merchants.map((merchant) => (
                                            <span key={merchant}>
                                                <span
                                                    style={{ backgroundColor: rbgaColors[index], color: colors[index] }}
                                                    className={styles.merchants}
                                                >
                                                    {merchant}
                                                </span>
                                            </span>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>

                )}
            </div>

            <Modal isOpen={showMerchantModal} onClose={() => setShowMerchantModal(false)}>
                <form className={styles.PopUp} onSubmit={handleMerchantSubmit}>

                    <h2>Прибави търговец</h2>
                    <label>
                        <p> Име</p>
                        <input id='merchantName'
                            value={merchantName}
                            onChange={e => setMerchantName(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <label>

                        <p>Категория</p>
                        <select
                            onChange={e => setName(e.target.value)}
                            required>
                            <option value="">-- Избери категория --</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category[0]}>
                                    {category[0]}
                                </option>
                            ))}
                        </select>
                    </label>
                    <br />
                    <div>
                        <button type='button' onClick={() => {
                            setMerchantName('');
                            setName('')
                            setShowMerchantModal(false)
                        }}>Отказ</button>
                        <button type="submit">Добави</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)}>
                <form onSubmit={handleCategorySubmit} className={styles.PopUp}>
                    <h2>Добави категория</h2>
                    <label>
                        <p>Име на категория:</p>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <div>
                        <button
                            type="button"
                            onClick={() => {
                                setName('');
                                setShowCategoryModal(false);
                            }}
                        >
                            Отказ
                        </button>
                        <button type="submit">Създай</button>
                    </div>
                </form>
            </Modal>
        </div>

    )
}
