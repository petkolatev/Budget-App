import styles from '../styles/Budget.module.css'
import {  getCategoryAmount, getCategoryTransactions } from '../lib/BudgetParser';
import { PieChart } from 'react-minimal-pie-chart';
import { OverallSpendingType } from '@/types/types';
import { Categories } from '@/pages/Budget';



export function OverallSpending(state: Readonly<OverallSpendingType>) {
  const transactions = state.transactions
  const spend = state.spend
  const received = state.received
  const pieChartData = transactions && Categories.map((category) => {
    const categoryTransactions = getCategoryTransactions(category[0], transactions)
    const categorySpend = getCategoryAmount(categoryTransactions, 'debit')
    return {
      title: category[0],
      value: categorySpend,
      color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
    }
  }).filter(val => val.value !== 0);

  return (
    <div className={styles.OverallSpending}>
      <div className={styles.tableTitle} > Разходи </div>
      <div className='total'>
        <span> Изхарчени: <strong>{spend?.toFixed(0)}</strong> </span>
        <span> Получени:  <strong>{received?.toFixed(0)}</strong> </span>
      </div>
      <PieChart
        data={pieChartData ?? []}
        label={({ dataEntry }) => dataEntry.title}
        labelStyle={() => ({
          fontSize: '3px',
          fontFamily: 'sans-serif',
        })}
        radius={22}
        labelPosition={112}
      />
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>Категория</th>
            <th>Изхарчени</th>
            <th>Получени</th>
            <th>Процент Разходи</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {transactions && Categories.map((category, index) => {
            const categoryTransactions = getCategoryTransactions(category[0], transactions)
            const categorySpend = getCategoryAmount(categoryTransactions, 'debit')
            const categoryReceived = getCategoryAmount(categoryTransactions, 'credit')
            const percentage = Math.round((categorySpend / spend!) * 100)
            return percentage !== 0 && <tr key={index}>
              <td>{category[0]}</td>
              <td>{categorySpend.toFixed(0)}</td>
              <td>{categoryReceived.toFixed(0)}</td>
              <td>{percentage} %</td>
            </tr>
          })}
        </tbody>
      </table>
      <div className={styles.divider}></div>
    </div >
  )
}
