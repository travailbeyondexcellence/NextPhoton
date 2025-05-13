"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    income: 4000,
    expense: 2400,
  },
  {
    name: "Feb",
    income: 3000,
    expense: 1398,
  },
  {
    name: "Mar",
    income: 2000,
    expense: 9800,
  },
  {
    name: "Apr",
    income: 2780,
    expense: 3908,
  },
  {
    name: "May",
    income: 1890,
    expense: 4800,
  },
  {
    name: "Jun",
    income: 2390,
    expense: 3800,
  },
  {
    name: "Jul",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Aug",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Sep",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Oct",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Nov",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Dec",
    income: 3490,
    expense: 4300,
  },
];

const FinanceChart = () => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  const chartStyles = {
    grid: {
      stroke: darkMode ? "#555" : "#ddd",
    },
    axis: {
      tick: {
        fill: darkMode ? "#888" : "#d1d5db",
      },
    },
    line: {
      income: {
        stroke: darkMode ? "#22577A" : "#C3EBFA",
      },
      expense: {
        stroke: darkMode ? "#4A4272" : "#CFCEFF",
      },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-600 rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold dark:text-gray-100">Finance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" style={{ stroke: chartStyles.grid.stroke }} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: chartStyles.axis.tick.fill }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis axisLine={false} tick={{ fill: chartStyles.axis.tick.fill }} tickLine={false} tickMargin={20} />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line type="monotone" dataKey="income" strokeWidth={5} style={{ stroke: chartStyles.line.income.stroke }} />
          <Line type="monotone" dataKey="expense" strokeWidth={5} style={{ stroke: chartStyles.line.expense.stroke }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
