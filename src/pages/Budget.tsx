import { useFilePicker } from 'use-file-picker';
import styles from '../styles/Budget.module.css'
import { parse, getCategoryTransactions, getCategoryAmount } from '../lib/BudgetParser';
import { Key, useEffect, useState } from 'react';
import { selectReceived, selectSpend } from '../lib/budgetSlice';
import { OverallSpending } from '../components/OverallSpending';
import { TransactionTable } from '../components/TransactionTable';
import { Transaction } from '@/types/types';

export let Categories: []

export function Budget() {
    const [state, setState] = useState<Transaction[]>([])
    const [openFileSelector, { filesContent }] = useFilePicker({
        readAs: "Text",
        accept: [".txt"]
    });

    const spend = selectSpend(state)
    const received = selectReceived(state)
    useEffect(() => {
        const data = localStorage.getItem('categories') 
        if(data){
            Categories = JSON.parse(data)
        }
        const saved = localStorage.getItem('state')
        if (saved) {
            const parsed = JSON.parse(saved)
            setState(parsed)
        }
    }, [])


    useEffect(() => {
        if (filesContent[0]?.content) {
            const budget = parse(filesContent[0].content);
            setState(budget)
            localStorage.setItem('state', JSON.stringify(budget))
        }

    }, [filesContent])


    return (
        <div>
            <div className={styles.headline}>
                <h2> Движения по сметка </h2>
                Движения по сметка от датата на регистрацията в е-банката.<br />
                Наредените преводи се печатат от Преводи/Наредени документи.<br />
            </div>
            <div className={styles.divider}></div>
            <div className={styles.dataPicket}>
                <button > Покажи </button>
                <button onClick={() => openFileSelector()}> Избери Файл </button>
            </div>
            {state.length !== 0 && <OverallSpending
                transactions={state}
                spend={spend}
                received={received}
            />
            }
            {state.length !== 0 && Categories!.map((category: string[], index: Key | null | undefined) => {
                const categoryTransactions = getCategoryTransactions(category[0], state)
                const categorySpend = getCategoryAmount(categoryTransactions, 'debit')
                return <TransactionTable
                    key={index}
                    title={category[0]}
                    transactions={categoryTransactions}
                    spend={categorySpend}
                    received={getCategoryAmount(categoryTransactions, 'credit')}
                    percentage={Math.round((categorySpend / spend!) * 100)}
                />
            })}
        </div>
    )
}

export default Budget
