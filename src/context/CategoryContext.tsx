import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type CategoryProviderProps = {
    children: ReactNode;
  };

const CategoryContext = createContext<{Categories:string[][]}>({Categories:[]});

export const CategoryProvider = ({ children }:CategoryProviderProps) => {
    const [Categories, setCategories] = useState([])

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/getCategories', {
                method: 'GET'
            })
            const data = await response.json()
            console.log(data);

            const Categories = data.categories.map((cat: { name: string; merchants: { name: string }[] }) => {
                const merchantNames = cat.merchants.map(m => m.name);
                return [cat.name, ...merchantNames];
            });

            setCategories(Categories)
        }
        fetchData()
    }, [])

    return (
        < CategoryContext.Provider value={{ Categories }}>
            {children}
        </CategoryContext.Provider>
    )
}

export const useDataContext = ( )=> useContext(CategoryContext)