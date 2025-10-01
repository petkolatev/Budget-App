"use client";

import { FormEvent } from "react";

export const handleCreateMerchant = async (
    e: FormEvent,
    name: string,
    merchantName: string,
    description: string,
    setLoading: (val: boolean) => void,
    setName: (val: string) => void,
    setMerchantName: (val: string) => void,
    setDescription: (val: string) => void,
    reloadCategories: () => void,
    setShowMerchantModal: (val: boolean) => void,
    showToast: (msg: string, type: "success" | "error") => void,
) => {
    e.preventDefault();
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
