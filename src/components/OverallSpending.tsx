import styles from '../styles/Budget.module.css';
import { getCategoryAmount, getCategoryTransactions } from '../lib/BudgetParser';
import { OverallSpendingType } from '@/types/types';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const renderCustomizedLabel = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
        cx, cy, midAngle, innerRadius, outerRadius, percent, name,
    } = props;

    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="#333"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize={12}
        >
            {`${name}: ${(percent * 100).toFixed(1)}%`}

        </text>
    );
};


export let COLORS: string[] = []

export function OverallSpending(props: Readonly<OverallSpendingType>) {
    const { categories, transactions, spend, received } = props;


    const pieChartData =
        transactions &&
        categories
            .map(([categoryName]) => {
                const categoryTransactions = getCategoryTransactions(categoryName, transactions);
                const categorySpend = getCategoryAmount(categoryTransactions, 'debit');
                COLORS.push('#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6))
                return {
                    name: categoryName,
                    value: categorySpend,
                };
            })
            .filter((val) => val.value !== 0);

    return (
        <div className={styles.OverallSpending}>
            <div className={styles.tableTitle}>Разходи</div>
            <div className="total">
                <span>
                    Изхарчени: <strong>{spend?.toFixed(0)}</strong>
                </span>
                <span>
                    Получени: <strong>{received?.toFixed(0)}</strong>
                </span>
            </div>

            <ResponsiveContainer width="100%" height={650}>
                <PieChart>
                    <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={260}
                        label={renderCustomizedLabel}
                        labelLine={false}
                    >
                        {pieChartData!.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

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
                    {transactions &&
                        categories.map(([categoryName], index) => {
                            const categoryTransactions = getCategoryTransactions(categoryName, transactions);
                            const categorySpend = getCategoryAmount(categoryTransactions, 'debit');
                            const categoryReceived = getCategoryAmount(categoryTransactions, 'credit');
                            const percentage = Math.round((categorySpend / spend!) * 100);
                            return (
                                percentage !== 0 && (
                                    <tr key={index}>
                                        <td>{categoryName}</td>
                                        <td>{categorySpend.toFixed(0)}</td>
                                        <td>{categoryReceived.toFixed(0)}</td>
                                        <td>{percentage} %</td>
                                    </tr>
                                )
                            );
                        })}
                </tbody>
            </table>

            <div className={styles.divider}></div>
        </div>
    );
}
