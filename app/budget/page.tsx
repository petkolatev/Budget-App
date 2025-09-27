"use client";

import { useSession } from "next-auth/react";
import { useDataContext } from "@/context/CategoryContext";
import { useToast } from "@/context/ToastContext";
import { useEffect } from "react";
import Budget from "@/components/Budget";

export default function BudgetPage() {
  const { data: session } = useSession();
  const { error } = useDataContext();
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  if (!session) return null;

  return (
    <div className="App">
      <Budget />
    </div>
  );
}
