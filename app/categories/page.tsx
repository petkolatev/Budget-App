"use client";

import { useDataContext } from "../../context/CategoryContext";
import styles from "@/styles/Category.module.css";
import { useState, FormEvent } from "react";
import Modal from "../../components/Modal";
import { useToast } from "../../context/ToastContext";
import Preloader from "../dashboard/Preloader";
import { useCreateMerchant } from "../hooks/useCreateMerchant";
import { useDeleteMerchant } from "../hooks/useDeleteMerchant";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useDeleteCategory } from "../hooks/useDeleteCategory";

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
  const { showToast } = useToast();

  const { createMerchant, loading: merchantLoading } = useCreateMerchant(
    reloadCategories,
    showToast,
    () => setShowMerchantModal(false),
  );
  const { deleteMerchant, loading: deleteMerchantLoading } = useDeleteMerchant(
    reloadCategories,
    showToast,
  );
  const { createCategory, loading: categoryLoading } = useCreateCategory(
    reloadCategories,
    showToast,
    () => setShowCategoryModal(false),
  );

  const { deleteCategory, loading: deleteLoading } = useDeleteCategory(
    reloadCategories,
    showToast,
  );

  const handleCreateCategory = (e: FormEvent) => {
    createCategory(e, name, () => setName(""));
  };

  const handleMerchantSubmit = (e: FormEvent) => {
    createMerchant(e, name, merchantName, description, () => {
      setName("");
      setMerchantName("");
      setDescription("");
    });
  };

  const handleDeleteCategory = (categoryName: string, categoryId: string) => {
    showConfirmation(
      `Сигурен ли си, че искаш да изтриеш ${categoryName}?`,
      async () => {
        await deleteCategory(categoryId);
        setConfirmModal(null);
      },
    );
  };

  const deleteAllMerchantsFromCategory = (
    categoryName: string,
    categoryId: string,
  ) => {
    showConfirmation(
      `Сигурен ли си, че искаш да изтриеш всички търговци от ${categoryName}?`,
      async () => {
        try {
          const res = await fetch("/api/merchant", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoryId }),
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
        }
      },
    );
  };

  const handleDeleteMerchant = (merchantName: string, merchantId: string) => {
    showConfirmation(
      `Сигурен ли си, че искаш да изтриеш ${merchantName}?`,
      async () => {
        await deleteMerchant(merchantId, merchantName);
        setConfirmModal(null);
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
          {categories.map((category) => {
            return (
              <div key={category.id} className={styles.categoryName}>
                <h2>
                  {category.name}
                  <button
                    onClick={() =>
                      handleDeleteCategory(category.name, category.id)
                    }
                  >
                    X
                  </button>
                </h2>

                <ul>
                  {category.merchants.map(
                    (merchant: { id: string; name: string }) => (
                      <li key={merchant.id}>
                        <span>{merchant.name}</span>
                        <button
                          onClick={() =>
                            handleDeleteMerchant(merchant.name, merchant.id)
                          }
                        >
                          X
                        </button>
                      </li>
                    ),
                  )}
                </ul>

                {category.merchants.length > 0 && (
                  <button
                    className={styles.addMerchant}
                    onClick={() => {
                      deleteAllMerchantsFromCategory(
                        category.name,
                        category.id,
                      );
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
                <option key={index} value={category.name}>
                  {category.name}
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
        <form onSubmit={handleCreateCategory} className={styles.PopUp}>
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
      loading: deleteLoading,
      {merchantLoading ||
        deleteMerchantLoading ||
        categoryLoading ||
        (deleteLoading && <Preloader />)}
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
