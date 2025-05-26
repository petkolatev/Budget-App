import { useFilePicker } from 'use-file-picker';
import styles from './Budget.module.css'
import { parse } from './BudgetParser';
import { useEffect, useState } from 'react';
import { Transaction } from './budgetSlice';
import { OverallSpending } from './OverallSpending';

export function Budget() {
    const [state, setState] = useState<Transaction[]>([])
    const [openFileSelector, { filesContent, loading }] = useFilePicker({
        readAs: "Text",
        accept: [".txt"]
    });


    useEffect(() => {
        if (filesContent[0]?.content) {

            const budget = parse(filesContent[0].content);

            setState(budget)
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
            {state && <OverallSpending
                transactions={state}
                spend={0}
                received={0}
            />
            }
        </div>
    )
}

export default Budget

function processFile(content: string): any {
    throw new Error('Function not implemented.');
}
