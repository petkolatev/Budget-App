"use client";

import { useDataContext } from "../../context/CategoryContext";
import styles from "@/styles/Category.module.css";
import { useState, FormEvent } from "react";
import Modal from "../../components/Modal";
import { useToast } from "../../context/ToastContext";
import Preloader from "../dashboard/Preloader";
import { handleCategorySubmit } from "../utils/handleCategorySubmit";

export default function CreateCategoryPage() {
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    action: () => void;
    message: string;
  } | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [name, setName] = useState<string>("");
  const [merchantName, setMerchantName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { categories, reloadCategories } = useDataContext();
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  const onSubmit = async (e: FormEvent) => {
    handleCategorySubmit(
      e,
      name,
      setLoading,
      setName,
      reloadCategories,
      setShowCategoryModal,
      showToast,
    );
  };

  const handleMerchantSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/createMerchants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, merchantName, description }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        setName("");
        setMerchantName("");
        setDescription("");
        setShowMerchantModal(false);
        reloadCategories();
      } else {
        showToast(`Error: ${data.error}`, "error");
      }
    } catch (error) {
      showToast(`Error: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (
    categoryName: string,
    categoryId: string,
  ) => {
    showConfirmation(
      `Сигурен ли си, че искаш да изтриеш ${categoryName}?`,
      async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/category/${categoryId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });

          const data = await res.json();
          if (res.ok) {
            showToast(data.message, "success");
            reloadCategories();
          } else {
            showToast(`Error: ${data.error}`, "error");
          }
          setConfirmModal(null);
        } catch (error) {
          showToast(`Error: ${error}`, "error");
        } finally {
          setLoading(false);
        }
      },
    );
  };

  const deleteAllMerchantsFromCategory = (categoryName: string) => {
    showConfirmation(
      `Сигурен ли си, че искаш да изтриеш всички търговци от ${categoryName}?`,
      async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/deleteAllMerchantsFromCategory", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoryName }),
          });

          const data = await res.json();

          if (res.status === 200) {
            showToast(data.message, "success");
            reloadCategories();
          } else {
            showToast(`Error: ${data.error}`, "error");
          }

          setConfirmModal(null);
        } catch (error) {
          showToast(`Error: ${error}`, "error");
        } finally {
          setLoading(false);
        }
      },
    );
  };

  const handleDeleteMerchant = (merchantName: string) => {
    showConfirmation(
      `Сигурен ли си, че искаш да изтриеш ${merchantName}?`,
      async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/deleteMerchant", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ merchantName }),
          });

          const data = await res.json();

          if (res.status === 200) {
            showToast(data.message, "success");
            reloadCategories();
          } else {
            showToast(`Error: ${data.error}`, "error");
          }

          setConfirmModal(null);
        } catch (error) {
          showToast(`Error: ${error}`, "error");
        } finally {
          setLoading(false);
        }
      },
    );
  };

  const showConfirmation = (message: string, onConfirm: () => void) => {
    setConfirmModal({ open: true, action: onConfirm, message });
  };

  return (
    <div>
      <div className={styles.create}>
        <button
          onClick={() => {
            setShowCategoryModal(true);
            setName("");
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

      <div className={styles.category}>
        <h1>Категории и търговци</h1>
        <div className={styles.deleteCategory}>
          {categories.map((group) => {
            const [categoryName, categoryId, ...merchants] = group;

            return (
              <div key={categoryId} className={styles.categoryName}>
                <h2>
                  {categoryName}
                  <button
                    onClick={() =>
                      handleDeleteCategory(categoryName, categoryId)
                    }
                  >
                    X
                  </button>
                </h2>

                <ul>
                  {merchants.map((merchant) => (
                    <li key={merchant}>
                      <span>{merchant}</span>
                      <button onClick={() => handleDeleteMerchant(merchant)}>
                        X
                      </button>
                    </li>
                  ))}
                </ul>
                {merchants.length > 0 && (
                  <button
                    className={styles.addMerchant}
                    onClick={() => {
                      deleteAllMerchantsFromCategory(categoryName);
                    }}
                  >
                    Изтрии всички
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={showMerchantModal}
        onClose={() => setShowMerchantModal(false)}
      >
        <form className={styles.PopUp} onSubmit={handleMerchantSubmit}>
          <h2>Прибави търговец</h2>
          <label>
            <p> Име</p>
            <input
              id="merchantName"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            <p>Категория</p>
            <select onChange={(e) => setName(e.target.value)} required>
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
            <button
              type="button"
              onClick={() => {
                setMerchantName("");
                setName("");
                setShowMerchantModal(false);
              }}
            >
              Отказ
            </button>
            <button type="submit">Добави</button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
      >
        <form onSubmit={onSubmit} className={styles.PopUp}>
          <h2>Добави категория</h2>
          <label>
            <p>Име на категория:</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <br />
          <div>
            <button
              type="button"
              onClick={() => {
                setName("");
                setShowCategoryModal(false);
              }}
            >
              Отказ
            </button>
            <button type="submit">Създай</button>
          </div>
        </form>
      </Modal>

      {loading && <Preloader />}

      {confirmModal?.open && (
        <Modal isOpen={true} onClose={() => setConfirmModal(null)}>
          <div className={styles.confirmation}>
            <h1>Изтриване на елемент</h1>
            <p>{confirmModal.message}</p>
            <div className={styles.buttons}>
              <button
                className={styles.no}
                onClick={() => setConfirmModal(null)}
              >
                {" "}
                Не
              </button>
              <button className={styles.yes} onClick={confirmModal.action}>
                {" "}
                Да
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
