import ReactECharts from "echarts-for-react";

interface LineChartProps {

  xData: string[];
  yData: number[];
  label?: string;
}

export default function LineChart({

  xData,
  yData,
  label = "Value"
}: LineChartProps) {
  const option = {
  
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: xData },
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
