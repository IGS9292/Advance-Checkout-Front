import ReactECharts from "echarts-for-react";

interface LineChartProps {
  title: string;
  xData: string[];
  yData: number[];
  label?: string;
}

export default function LineChart({
  title,
  xData,
  yData,
  label = "Value"
}: LineChartProps) {
  const option = {
    title: { text: title, left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: xData },
    yAxis: { type: "value" },
    series: [
      {
        name: label,
        data: yData,
        type: "line",
        smooth: true,
        areaStyle: {}
      }
    ]
  };
  console.log("LineChart Dta:", option.series);
  return <ReactECharts option={option} style={{ height: 300 }} />;
}
