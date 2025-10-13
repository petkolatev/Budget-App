import { PieLabelRenderProps } from "recharts";

export const renderCustomizedLabel = (props: PieLabelRenderProps) => {
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

  const radius = Number(outerRadius) + 30;
  const x = Number(cx) + radius * Math.cos(-midAngle! * RADIAN);
  const y = Number(cy) + radius * Math.sin(-midAngle! * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor={Number(x) > Number(cx) ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${name}: ${(Number(percent) * 100).toFixed(1)}%`}
    </text>
  );
};
