import { useState } from "react";

export const useDeleteMerchant = (
    reloadCategories: () => void,
    showToast: (msg: string, type: "success" | "error") => void
) => {
    const [loading, setLoading] = useState(false);

    const deleteMerchant = async (merchantId: string, merchantName: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/merchant/${merchantId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ merchantName }),
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

    return { deleteMerchant, loading };
};
