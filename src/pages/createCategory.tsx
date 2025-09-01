import { useDataContext } from '@/context/CategoryContext';
import styles from '../styles/Category.module.css';
import { useState, FormEvent } from 'react';
import Modal from '@/components/Modal';

export default function CreateCategoryPage() {
  const [createCategory, setCreateCategory] = useState(false);
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [name, setName] = useState<string>('');
  const [merchantName, setMerchantName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [message, setMessage] = useState<string>('');
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
      setName('');
      reloadCategories();
      setCreateCategory(false);
    } else {
      setMessage(`Error: ${data.error}`);
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
      setName('')
      setMerchantName('');
      setDescription('');
      setShowMerchantModal(false);
      reloadCategories();
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  const handleDelete = async (categoryName: string, merchantName: string) => {
    const deletedItem = merchantName || categoryName;
    const confirmed = window.confirm(`Сигурен ли си, че искаш да изтриеш ${deletedItem}?`);
    if (!confirmed) return;

    const res = await fetch('/api/deleteMerchant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryName, merchantName }),
    });

    if (res.status === 200) {
      reloadCategories();
    }
  };

  return (
    <div>
      <div className={styles.category}>
        <button onClick={() => {setCreateCategory(!createCategory),setName('')}}>Добави категория</button>
        {createCategory && (
          <div className={styles.category}>
            <form onSubmit={handleCategorySubmit}>
              <label>
                Име на категория:
                <input value={name} onChange={e => setName(e.target.value)} required />
              </label>
              <button type="submit">Създай</button>
            </form>
            {message && <p className={styles.msg}>{message}</p>}
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
                  {categoryName}{' '}
                  <button onClick={() => handleDelete(categoryName, '')}>X</button>
                </h2>

                <button
                  className={styles.addMerchant}
                  onClick={() => {
                    setName(categoryName);
                    setShowMerchantModal(true);
                  }}
                >
                  Добави търговец
                </button>

                <ul>
                  {merchants.map(merchant => (
                    <li key={merchant}>
                      <span>{merchant}</span>
                      <button onClick={() => handleDelete(categoryName, merchant)}>X</button>
                    </li>
                  ))}
                </ul>
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
    </div>
  );
}
