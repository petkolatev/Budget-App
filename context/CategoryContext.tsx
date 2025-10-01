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

type Merchant = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
  merchants: Merchant[];
};

type CategoryContextType = {
  categories: Category[];
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
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/merchant");
      const data = await response.json();

      const formattedCategories: Category[] = data.categories.map(
        (cat: {
          name: string;
          categoryId: string;
          merchants: { name: string; merchantId: string }[];
        }) => ({
          name: cat.name,
          id: cat.categoryId,
          merchants: cat.merchants.map((m) => ({
            name: m.name,
            id: m.merchantId,
          })),
        }),
      );

      setCategories(formattedCategories);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Server error";
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
