import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type CategoryProviderProps = {
    children: ReactNode;
};
type CategoryContextType = {
    categories: string[][];
    error: string | null;
};

const CategoryContext = createContext<CategoryContextType>({ categories: [], error: null });

export const CategoryProvider = ({ children }: CategoryProviderProps) => {
    const [error, setError] = useState<string | null>(null)
    const [categories, setCategories] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/getCategories', {
                    method: 'GET'
                })
                const data = await response.json()

                const categories = data.categories.map((cat: { name: string; merchants: { name: string }[] }) => {
                    const merchantNames = cat.merchants.map(m => m.name);
                    return [cat.name, ...merchantNames];
                });

                setCategories(categories)

            } catch (err: any) {
                setError('Fail to fetch data')
            }
        }
        fetchData()
    }, [])

    return (
        < CategoryContext.Provider value={{ categories, error }}>
            {children}
        </CategoryContext.Provider>
    )
}

export const useDataContext = () => useContext(CategoryContext)