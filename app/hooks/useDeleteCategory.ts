import { useState } from "react";

export const useDeleteCategory = (
  reloadCategories: () => void,
  showToast: (msg: string, type: "success" | "error") => void
) => {
  const [loading, setLoading] = useState(false);

  const deleteCategory = async (categoryId: string) => {
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
    } catch (error) {
      showToast(`Error: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return { deleteCategory, loading };
};
