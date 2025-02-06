"use client";

import { Category } from "@prisma/client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface Props {
  data: ({
    _count: {
      posts: number;
    };
  } & Category)[];
}

const CategoriesChart = ({ data }: Props) => {
  const shortenName = (name: string) => {
    return name.length > 7 ? name.slice(0, 7) + "..." : name;
  };

  // Modify data to include shortened names
  const modifiedData = data.map((item) => ({
    ...item,
    name: shortenName(item.name),
  }));

  return (
    <div className="h-full card flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h4 className="mb-0 flex flex-col">
          {data.length} Categories
          <span className="text-gray-500 text-sm font-normal">
            Count based on category
          </span>
        </h4>
        <p className="text-gray-500 text-xs">Details</p>
      </div>
      <div className="flex justify-center items-center h-full">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={modifiedData}>
            <Tooltip />
            <CartesianGrid vertical={false} strokeOpacity={0.5} />
            <Bar
              radius={[5, 5, 0, 0]}
              barSize={40}
              dataKey="_count.posts"
              fill="#5B99F4"
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              width={25}
            />
            <XAxis
              fontSize={"0.8rem"}
              tickLine={false}
              dataKey={"name"}
              dy={6}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <p className="text-gray-500 text-xs">Categories Post Count</p>
        </div>
        <p className="badge badge-success">%74</p>
      </div>
    </div>
  );
};

export default CategoriesChart;
