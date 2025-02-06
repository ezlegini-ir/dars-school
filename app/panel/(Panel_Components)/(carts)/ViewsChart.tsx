"use client";

import React, { useEffect, useState } from "react";
import {
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const ViewsChart = () => {
  const [data, setData] = useState([]);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    async function fetchViews() {
      try {
        const res = await fetch("/api/analytics"); // Fetch data from API
        const data = await res.json();
        setData(data.data || []);
        setTotalViews(
          data.data?.reduce(
            (sum: number, item: { views: number }) => sum + item.views,
            0
          ) || 0
        );
      } catch (error) {
        console.error("Error fetching views data:", error);
      }
    }

    fetchViews();
  }, []);

  return (
    <div className="h-full card flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h4 className="mb-0 flex flex-col">
          {totalViews || "Loading..."}
          <span className="text-gray-500 text-sm font-normal">views/30d</span>
        </h4>
        <p className="text-gray-500 text-xs">Details</p>
      </div>
      <div className="flex justify-center items-center h-full">
        <ResponsiveContainer width={"100%"} height={300}>
          <AreaChart data={data}>
            <CartesianGrid vertical={false} strokeOpacity={"0.5"} />

            <XAxis
              style={{ opacity: 0.5 }}
              interval={3}
              dy={6}
              fontSize={"0.8rem"}
              dataKey={"name"}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              fontSize={"0.8rem"}
              allowDecimals={false}
            />
            <Tooltip />
            <defs>
              <linearGradient id="colorScale" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              stroke="#3b82f6"
              fill="url(#colorScale)"
              dataKey={"views"}
              type={"monotone"}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <p className="text-gray-500 text-xs">Views/Day</p>
        </div>
        <p className="badge badge-success">%74</p>
      </div>
    </div>
  );
};

export default ViewsChart;
