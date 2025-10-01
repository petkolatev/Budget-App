"use client";

import { FormEvent } from "react";

export const handleCategorySubmit = async (
    e: FormEvent,
    name: string,
    setLoading: (val: boolean) => void,
    setName: (val: string) => void,
    reloadCategories: () => void,
    setShowCategoryModal: (val: boolean) => void,
    showToast: (msg: string, type: "success" | "error") => void,
) => {
    e.preventDefault();
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
            setName("");
            reloadCategories();
            setShowCategoryModal(false);
        } else {
            showToast(`Error: ${data.error}`, "error");
        }
    } catch (error) {
        showToast(`Error: ${error}`, "error");
    } finally {
        setLoading(false);
    }
};
