import styles from '../styles/PieChart.module.css';
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

const hexToRgba = ((hex: string, opacity: number) => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
})


export let rbgaColors: string[] = []
export let hexColors: string[] = []

export function RenderPieChart(props: Readonly<OverallSpendingType>) {
    const { categories, transactions, spend, received } = props;
    let mostSpendedCategory: { name: string, value: number } | undefined


    const pieChartData =
        transactions &&
        categories
            .map(([categoryName]) => {
                const categoryTransactions = getCategoryTransactions(categoryName, transactions);
                const categorySpend = getCategoryAmount(categoryTransactions, 'debit');
                hexColors.push('#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6))
                return {
                    name: categoryName,
                    value: categorySpend,
                };
            })
            .filter((val) => val.value !== 0);

    hexColors.map((el) => {
        rbgaColors.push(hexToRgba(el, 0.3))
    })
    mostSpendedCategory = pieChartData?.reduce((prev, current) => current.value > prev.value ? current : prev)

    return (
        <div className={styles.OverallSpending}>
            <h1 className={styles.tableTitle}>Месечен бюджет</h1>
            <div className={styles.total}>
                <span>
                    Общо разходи <strong>{spend?.toFixed(0)}</strong>
                </span>
                <span>
                    Общо приходи <strong>{received?.toFixed(0)}</strong>
                </span>
                <span>
                    Водеща категория <strong>{mostSpendedCategory?.name}</strong>
                </span>
            </div>

            <ResponsiveContainer className={styles.pieChart} width="100%" height={650}>
                <PieChart>
                    <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={200}
                        label={renderCustomizedLabel}
                        labelLine={false}
                    >
                        {pieChartData!.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={hexColors[index % hexColors.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
