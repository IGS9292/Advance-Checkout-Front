
import ReactECharts from "echarts-for-react";
interface PieChartProps {
  title: string;
  data: { name: string; value: number }[];
}

export default function PieChart({ title, data }: PieChartProps) {
  const option = {
    title: { text: title, left: "center" },
    tooltip: { trigger: "item" },
    legend: { bottom: 10, left: "center" },
    series: [
      {
        type: "pie",
        radius: "50%",
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: 300 }} />;
}
