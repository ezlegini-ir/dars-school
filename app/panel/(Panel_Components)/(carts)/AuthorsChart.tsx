"use client";

import { userRole } from "@prisma/client";
import { Users } from "lucide-react";
import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  authors: ({
    _count: {
      Post: number;
    };
  } & {
    id: number;
    name: string;
    email: string;
    emailVerified: Date | null;
    role: userRole;
  })[];
}

const AuthorsChart = ({ authors }: Props) => {
  const totalPosts = authors.reduce(
    (total, author) => total + author._count.Post,
    0
  );
  const data = [
    {
      _count: { Post: totalPosts },
      name: "total",
      fill: "white",
    },
    ...authors,
  ];

  const renderTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const { name, _count } = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white border border-gray-300 p-2">
          <p>{name}</p>
          <p className="text-xs">Posts: {_count.Post}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full card flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h4 className="mb-0 flex flex-col">
          Active Authors
          <span className="text-gray-500 text-sm font-normal">views/28d</span>
        </h4>
        <p className="text-gray-500 text-xs">Details</p>
      </div>
      <div className="relative h-full">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <Tooltip content={renderTooltip} />
            <RadialBar
              cornerRadius={1000}
              background
              dataKey="_count.Post"
              fill="#5B99F4"
              color="#5B99F4"
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-blue-500">
          <Users size={30} />
        </div>
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

export default AuthorsChart;
