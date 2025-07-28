// components/Widgets/charts/BarChart.tsx
import ReactECharts from "echarts-for-react";

interface BarChartProps {
  title: string;
  categories: string[];
  values: number[];
  label?: string;
}

export default function BarChart({
  title,
  categories,
  values,
  label = "Count"
}: BarChartProps) {
  const option = {
    title: { text: title, left: "center" },
    tooltip: {},
    xAxis: { type: "category", data: categories },
    yAxis: { type: "value" },
    series: [
      {
        name: label,
        type: "bar",
        data: values,
        itemStyle: { color: "#1976d2" }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: 300 }} />;
}
