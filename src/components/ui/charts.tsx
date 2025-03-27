
import * as React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "./chart";

// Helper functions
const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A4DE6C",
  "#8884D8", "#D0ED57", "#83a6ed", "#8dd1e1", "#82ca9d",
];

const getColor = (index: number) => COLORS[index % COLORS.length];

type BaseChartProps = {
  data: any[];
  index: string;
  categories: string[];
  theme?: "light" | "dark";
  className?: string;
  valueFormatter?: (value: number) => string;
  showAnimation?: boolean;
};

// Bar Chart Component
interface BarChartProps extends BaseChartProps {
  stack?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  index,
  categories,
  stack = false,
  theme = "light",
  className,
  valueFormatter = (value) => `${value}`,
  showAnimation = false,
}) => {
  const chartConfig = React.useMemo(() => {
    return categories.reduce((acc, category, i) => {
      acc[category] = {
        label: category,
        color: getColor(i),
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>);
  }, [categories]);

  return (
    <ChartContainer config={chartConfig} className={className}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={index} />
        <YAxis />
        <Tooltip
          content={({ active, payload, label }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              label={label}
              formatter={(value, name) => valueFormatter(Number(value))}
            />
          )}
        />
        <Legend
          content={({ payload }) => (
            <ChartLegendContent payload={payload} />
          )}
        />
        {categories.map((category, index) => (
          <Bar
            key={category}
            dataKey={category}
            fill={getColor(index)}
            stroke={getColor(index)}
            stackId={stack ? "stack" : undefined}
            isAnimationActive={showAnimation}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};

// Line Chart Component
export const LineChart: React.FC<BaseChartProps> = ({
  data,
  index,
  categories,
  theme = "light",
  className,
  valueFormatter = (value) => `${value}`,
  showAnimation = false,
}) => {
  const chartConfig = React.useMemo(() => {
    return categories.reduce((acc, category, i) => {
      acc[category] = {
        label: category,
        color: getColor(i),
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>);
  }, [categories]);

  return (
    <ChartContainer config={chartConfig} className={className}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={index} />
        <YAxis />
        <Tooltip
          content={({ active, payload, label }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              label={label}
              formatter={(value, name) => valueFormatter(Number(value))}
            />
          )}
        />
        <Legend
          content={({ payload }) => (
            <ChartLegendContent payload={payload} />
          )}
        />
        {categories.map((category, index) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={getColor(index)}
            activeDot={{ r: 8 }}
            isAnimationActive={showAnimation}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
};

// Pie Chart Component
export const PieChart: React.FC<BaseChartProps> = ({
  data,
  index,
  categories,
  theme = "light",
  className,
  valueFormatter = (value) => `${value}`,
  showAnimation = false,
}) => {
  const category = categories[0]; // Pie chart typically only uses one category
  
  const chartConfig = React.useMemo(() => {
    return data.reduce((acc, item, i) => {
      acc[item[index]] = {
        label: item[index],
        color: getColor(i),
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>);
  }, [data, index]);

  return (
    <ChartContainer config={chartConfig} className={className}>
      <RechartsPieChart>
        <Pie
          data={data}
          nameKey={index}
          dataKey={category}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          isAnimationActive={showAnimation}
          label={({ name, percent }) => 
            `${name}: ${Math.round(percent * 1000) / 10}%`
          }
        >
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={getColor(i)} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              nameKey={index}
              formatter={(value, name) => {
                // For percentage values, round to 1 decimal
                if (typeof value === 'number' && name === category) {
                  const percentage = Math.round(value * 1000) / 10;
                  return `${percentage}%`;
                }
                return valueFormatter(Number(value));
              }}
            />
          )}
        />
        <Legend
          content={({ payload }) => (
            <ChartLegendContent payload={payload} nameKey={index} />
          )}
        />
      </RechartsPieChart>
    </ChartContainer>
  );
};

// Donut Chart Component
export const DonutChart: React.FC<BaseChartProps> = ({
  data,
  index,
  categories,
  theme = "light",
  className,
  valueFormatter = (value) => `${value}`,
  showAnimation = false,
}) => {
  const category = categories[0]; // Donut chart typically only uses one category
  
  const chartConfig = React.useMemo(() => {
    return data.reduce((acc, item, i) => {
      acc[item[index]] = {
        label: item[index],
        color: getColor(i),
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>);
  }, [data, index]);

  return (
    <ChartContainer config={chartConfig} className={className}>
      <RechartsPieChart>
        <Pie
          data={data}
          nameKey={index}
          dataKey={category}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          isAnimationActive={showAnimation}
          label={({ name, percent }) => 
            `${name}: ${Math.round(percent * 1000) / 10}%`
          }
        >
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={getColor(i)} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              nameKey={index}
              formatter={(value, name) => {
                // For percentage values, round to 1 decimal
                if (typeof value === 'number' && name === category) {
                  const percentage = Math.round(value * 1000) / 10;
                  return `${percentage}%`;
                }
                return valueFormatter(Number(value));
              }}
            />
          )}
        />
        <Legend
          content={({ payload }) => (
            <ChartLegendContent payload={payload} nameKey={index} />
          )}
        />
      </RechartsPieChart>
    </ChartContainer>
  );
};
