import React from "react";
import ReactECharts from "echarts-for-react";

export interface RevenueMonth {
  month: string; // "2025-07"
  maxRevenue: number;
  minRevenue: number;
  maxShop: string;
  minShop: string;
}

interface DoubleBarChartProps {
  data: RevenueMonth[];
}

// Fixed month names for display
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

const DoubleBarChart: React.FC<DoubleBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) return <div>No data available</div>;

  // Initialize series arrays for all months
  const highestSeries: any[] = Array(12).fill({ value: 0, shop: "" });
  const lowestSeries: any[] = Array(12).fill({ value: 0, shop: "" });

  // Map actual data into correct month slot
  data.forEach((item) => {
    const date = new Date(item.month + "-01");
    const monthIndex = date.getMonth(); // 0 = Jan
    highestSeries[monthIndex] = {
      value: item.maxRevenue,
      shop: item.maxShop
    };
    lowestSeries[monthIndex] = {
      value: item.minRevenue,
      shop: item.minShop
    };
  });

  // Dynamic Y-axis
  const allValues = [
    ...highestSeries.map((d) => d.value),
    ...lowestSeries.map((d) => d.value)
  ];
  const yMax = Math.ceil(Math.max(...allValues) * 1.1);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        if (!params || !params.length) return "";

        const month = params[0].axisValue;
        let content = `<div style="min-width:150px; ">
        <strong>${month}</strong>
        <ul style=" margin:5px 0;">`;

        params.forEach((p: any) => {
          if (p.data?.value > 0) {
            const color = p.color || "#000";
            content += `<li style="margin-bottom:4px; list-style:none;">
            <span style="color:${color}; font-weight:bold;">${p.seriesName}</span><br/>
            <span>${p.data.shop}</span>: <b>$${p.data.value}</b>
          </li>`;
          }
        });

        content += "</ul></div>";
        return content;
      }
    },
    legend: { data: ["Highest Revenue", "Lowest Revenue"], bottom: 0 },
    xAxis: { type: "category", data: monthNames },
    yAxis: { type: "value", max: yMax },
    series: [
      {
        name: "Highest Revenue",
        type: "bar",
        data: highestSeries,
        itemStyle: { color: "#4caf50" }
        //  itemStyle: { color: "#5470c6" }
      },
      {
        name: "Lowest Revenue",
        type: "bar",
        data: lowestSeries,
        itemStyle: { color: "#f44336" }
        //  itemStyle: { color: "#91cc75" }
      }
    ]
  };

  return (
    <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
  );
};

export default DoubleBarChart;
