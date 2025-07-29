// components/Widgets/charts/BarChart.tsx
import ReactECharts from "echarts-for-react";

interface BarChartProps {
  categories: string[];
  values: number[];
  label?: string;
}

export default function BarChart({
  categories,
  values,
  label = "Count"
}: BarChartProps) {
  const option = {
    tooltip: {},
    xAxis: { type: "category", data: categories },
    yAxis: { type: "value" },
    toolbox: {
      show: true,
      orient: "horizontal",
      top: 0,
      right: 0,
      itemSize: 16,
      feature: {
        saveAsImage: {
          title: "Save",
          type: "png",
          name: "chart",
          pixelRatio: 2
        }
      }
    },
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
