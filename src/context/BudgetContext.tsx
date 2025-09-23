import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Transaction } from '@/types/types';

type BudgetProviderProps = {
    children: ReactNode;
};

type BudgetContextType = {
    budget: Transaction[];
    setBudget: (budget: Transaction[]) => void;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: BudgetProviderProps) => {
    const [budget, setBudget] = useState<Transaction[]>([]);

    return (
        <BudgetContext.Provider value={{ budget, setBudget }}>
            {children}
        </BudgetContext.Provider>
    );
};

export const useBudget = () => {
    const context = useContext(BudgetContext);
    if (!context) {
        throw new Error('useBudget must be used within a BudgetProvider');
    }
    return context;
};
