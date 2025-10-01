import { TransactionTableProps } from "../models/types";
import styles from "../styles/Budget.module.css";

export function TransactionTable(props: TransactionTableProps) {
    const transactions = props.transactions;
    const spend = props.spend;
    const received = props.received;
    const percentage = props.percentage;
    const title = props.title;

    return (
        <div>
            <div className={styles.tableTitle}> {title} </div>
            <div className={styles.summary}>
                <span>
                    {" "}
                    Изхарчени: <strong>{spend?.toFixed(2)}</strong>{" "}
                </span>
                <span>
                    {" "}
                    Получени: <strong>{received?.toFixed(2)}</strong>{" "}
                </span>
                <span>
                    {" "}
                    Процент Разходи: <strong>{percentage} %</strong>{" "}
                </span>
            </div>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        <th>
                            <span className={styles.sort}>Счет. дата</span>
                        </th>
                        <th className={styles.highlight}>
                            <span className={styles.sort}>Плащания</span>
                        </th>
                        <th className={styles.highlight}>
                            <span className={styles.sort}>Постъпления</span>
                        </th>
                        <th>Категория</th>
                        <th>Документи</th>
                        <th>Кореспондент</th>
                        <th>Основание за плащане</th>
                        <th>Още пояснения</th>
                    </tr>
                </thead>
                <tbody className={styles.tbody}>
                    {transactions.length === 0 ?? <div> Няма транзакции </div>}
                    {transactions?.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.date}</td>
                            <td className={styles.budgetTable}>
                                {transaction.type === "debit" ? transaction.amount : ""}
                            </td>
                            <td className={styles.highlight}>
                                {transaction.type === "credit" ? transaction.amount : ""}
                            </td>
                            <td>{transaction.category}</td>
                            <td>{transaction.document}</td>
                            <td>{transaction.contragent}</td>
                            <td>{transaction.reason}</td>
                            <td>{transaction.info}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.divider}></div>
        </div>
    );
}
