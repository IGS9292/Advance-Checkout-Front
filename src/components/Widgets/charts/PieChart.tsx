import { color } from "echarts";
import ReactECharts from "echarts-for-react";
interface PieChartProps {
  data: { name: string; value: number }[];
}

export default function PieChart({ data }: PieChartProps) {
  const option = {
    tooltip: { trigger: "item" },
    legend: {
      top: 0,
      // bottom: 10,
      left: "center",
      textStyle: {
        color: "#808080",
        fontSize: 12
      }
    },
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
        type: "pie",
        radius: "50%",
        data,
        label: {
          color: "#808080",
          fontWeight: "bold"
        },
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
