import { PieLabelProps } from "recharts/types/polar/Pie";

export const renderCustomizedLabel = (props: PieLabelProps) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, outerRadius, percent, name } = props;

    if (
        cx === undefined ||
        cy === undefined ||
        midAngle === undefined ||
        outerRadius === undefined ||
        percent === undefined ||
        name === undefined
    ) {
        return null;
    }

    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="#333"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize={12}
        >
            {`${name}: ${(percent * 100).toFixed(1)}%`}
        </text>
    );
};
