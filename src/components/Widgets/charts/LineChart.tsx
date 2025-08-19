import React from "react";
import ReactECharts from "echarts-for-react";

interface SeriesData {
  name: string; // shop name or label
  data: number[];
}

interface LineChartProps {
  xData: string[];
  yData: SeriesData[]; // multiple shops
}

export default function LineChart({ xData, yData }: LineChartProps) {
  const option = {
    tooltip: { trigger: "axis" },
    legend: {
      top: 0,
      left: "center"
    },
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
          name: "orders-per-day",
          pixelRatio: 2
        }
      }
    },
    series: yData.map((s) => ({
      name: s.name,
      type: "line",
      smooth: true,
      areaStyle: {}, // keep filled style
      data: s.data
    }))
  };

  console.log("LineChart Series:", option.series);
  return <ReactECharts option={option} style={{ height: 300 }} />;
}
