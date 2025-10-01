// hooks/useCreateMerchant.ts
import { useState } from "react";

export const useCreateMerchant = (
    reloadCategories: () => void,
    showToast: (msg: string, type: "success" | "error") => void,
    closeModal: () => void
) => {
    const [loading, setLoading] = useState(false);

    const createMerchant = async (
        e: React.FormEvent,
        name: string,
        merchantName: string,
        description: string,
        resetFields: () => void
    ) => {
        e.preventDefault();
        if (!name.trim() || !merchantName.trim()) {
            showToast("Category and Merchant are required", "error");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/merchant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, merchantName, description }),
            });

            const data = await res.json();
            if (data.success) {
                showToast(data.message, "success");
                resetFields();
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

    return { createMerchant, loading };
};
