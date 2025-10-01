import { useState } from "react";

export const useCreateCategory = (
  reloadCategories: () => void,
  showToast: (msg: string, type: "success" | "error") => void,
  closeModal: () => void
) => {
  const [loading, setLoading] = useState(false);

  const createCategory = async (
    e: React.FormEvent,
    name: string,
    resetField: () => void
  ) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Category is required", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        resetField();
        closeModal();
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

  return { createCategory, loading };
};
