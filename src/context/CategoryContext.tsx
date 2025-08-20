import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type CategoryProviderProps = {
    children: ReactNode;
};

const CategoryContext = createContext<{ categories: string[][] }>({ categories: [] });

export const CategoryProvider = ({ children }: CategoryProviderProps) => {
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

            } catch (error) {
                throw new Error('Failed to fetch categories')
            }
        }
        fetchData()
    }, [])

    return (
        < CategoryContext.Provider value={{ categories }}>
            {children}
        </CategoryContext.Provider>
    )
}

export const useDataContext = () => useContext(CategoryContext)