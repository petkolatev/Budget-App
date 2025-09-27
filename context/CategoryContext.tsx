"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type CategoryProviderProps = {
  children: ReactNode;
};

type CategoryContextType = {
  categories: string[][];
  error: string | null;
  reloadCategories: () => void;
};

const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  error: null,
  reloadCategories: () => {},
});

export const CategoryProvider = ({ children }: CategoryProviderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[][]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/getMerchants");
      const data = await response.json();
      const formattedCategories = data.categories.map(
        (cat: { name: string; merchants: { name: string }[] }) => {
          const merchantNames = cat.merchants.map((m) => m.name);
          return [cat.name, ...merchantNames];
        },
      );
      setCategories(formattedCategories);
    } catch (error: unknown) {
      let errorMessage = "Server error";

      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <CategoryContext.Provider
      value={{ categories, error, reloadCategories: fetchData }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useDataContext = () => useContext(CategoryContext);
