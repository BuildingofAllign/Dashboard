
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
  Sector,
  AreaChart as RechartsAreaChart,
  Area,
} from "recharts";
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "./chart";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

// Enhanced color palette with better dark mode support
const LIGHT_COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A4DE6C",
  "#8884D8", "#D0ED57", "#83a6ed", "#8dd1e1", "#82ca9d",
];

const DARK_COLORS = [
  "#2196F3", "#00E5FF", "#FFD54F", "#FF9E80", "#CCFF90",
  "#B388FF", "#F4FF81", "#90CAF9", "#80DEEA", "#A5D6A7",
];

type BaseChartProps = {
  data: any[];
  index: string;
  categories: string[];
  theme?: "light" | "dark";
  className?: string;
  valueFormatter?: (value: number) => string;
  showAnimation?: boolean;
  height?: number | string;
  interactive?: boolean;
  emptyText?: string;
};

// Helper function to get color based on theme
const useChartColors = () => {
  const { isDarkMode } = useTheme();
  return isDarkMode ? DARK_COLORS : LIGHT_COLORS;
};

// Component to display when no data is available
const EmptyDataDisplay = ({ text = "No data available" }: { text?: string }) => (
  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
    <p>{text}</p>
  </div>
);

// Bar Chart Component with enhanced functionality
interface BarChartProps extends BaseChartProps {
  stack?: boolean;
  grid?: boolean;
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
  height = 300,
  interactive = true,
  grid = true,
  emptyText,
}) => {
  const colors = useChartColors();
  
  const getColor = (index: number) => colors[index % colors.length];

  const chartConfig = React.useMemo(() => {
    return categories.reduce((acc, category, i) => {
      acc[category] = {
        label: category,
        color: getColor(i),
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>);
  }, [categories]);

  if (!data || data.length === 0) {
    return <EmptyDataDisplay text={emptyText} />;
  }

  return (
    <ChartContainer config={chartConfig} className={className}>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            {grid && <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />}
            <XAxis 
              dataKey={index} 
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  label={label}
                  formatter={(value, name) => valueFormatter(Number(value))}
                />
              )}
              wrapperStyle={{ outline: "none" }}
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
                radius={[4, 4, 0, 0]}
                className={`${interactive ? "cursor-pointer" : ""}`}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

// Line Chart Component with enhanced functionality
export const LineChart: React.FC<BaseChartProps & { grid?: boolean; area?: boolean }> = ({
  data,
  index,
  categories,
  theme = "light",
  className,
  valueFormatter = (value) => `${value}`,
  showAnimation = false,
  height = 300,
  grid = true,
  area = false,
  interactive = true,
  emptyText,
}) => {
  const colors = useChartColors();
  
  const getColor = (index: number) => colors[index % colors.length];

  const chartConfig = React.useMemo(() => {
    return categories.reduce((acc, category, i) => {
      acc[category] = {
        label: category,
        color: getColor(i),
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>);
  }, [categories]);

  if (!data || data.length === 0) {
    return <EmptyDataDisplay text={emptyText} />;
  }

  return (
    <ChartContainer config={chartConfig} className={className}>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {area ? (
            <RechartsAreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              {grid && <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />}
              <XAxis 
                dataKey={index} 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload, label }) => (
                  <ChartTooltipContent
                    active={active}
                    payload={payload}
                    label={label}
                    formatter={(value, name) => valueFormatter(Number(value))}
                  />
                )}
                wrapperStyle={{ outline: "none" }}
              />
              <Legend
                content={({ payload }) => (
                  <ChartLegendContent payload={payload} />
                )}
              />
              {categories.map((category, index) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={getColor(index)}
                  fill={getColor(index)}
                  fillOpacity={0.3}
                  activeDot={{ r: 8 }}
                  isAnimationActive={showAnimation}
                  className={`${interactive ? "cursor-pointer" : ""}`}
                />
              ))}
            </RechartsAreaChart>
          ) : (
            <RechartsLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              {grid && <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />}
              <XAxis 
                dataKey={index} 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload, label }) => (
                  <ChartTooltipContent
                    active={active}
                    payload={payload}
                    label={label}
                    formatter={(value, name) => valueFormatter(Number(value))}
                  />
                )}
                wrapperStyle={{ outline: "none" }}
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
                  strokeWidth={2}
                  dot={{ r: 4, fill: getColor(index), stroke: getColor(index) }}
                  activeDot={{ r: 8 }}
                  isAnimationActive={showAnimation}
                  className={`${interactive ? "cursor-pointer" : ""}`}
                />
              ))}
            </RechartsLineChart>
          )}
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

// Active shape for interactive pie charts
const renderActiveShape = (props: any) => {
  const { 
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, name
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 15}
        outerRadius={outerRadius + 17}
        fill={fill}
      />
      <text x={cx} y={cy - 20} dy={8} textAnchor="middle" fill={fill} className="text-base font-medium">
        {name}
      </text>
      <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill={fill} className="text-lg font-semibold">
        {value}
      </text>
      <text x={cx} y={cy + 30} dy={8} textAnchor="middle" fill={fill} className="text-sm">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};

// Pie Chart Component with enhanced functionality
export const PieChart: React.FC<BaseChartProps & { innerRadius?: number }> = ({
  data,
  index,
  categories,
  theme = "light",
  className,
  valueFormatter = (value) => `${value}`,
  showAnimation = false,
  height = 300,
  innerRadius = 0,
  interactive = true,
  emptyText,
}) => {
  const colors = useChartColors();
  const getColor = (index: number) => colors[index % colors.length];
  const category = categories[0]; // Pie chart typically only uses one category
  const [activeIndex, setActiveIndex] = React.useState(-1);
  
  const onPieEnter = (_: any, index: number) => {
    if (interactive) {
      setActiveIndex(index);
    }
  };
  
  const onPieLeave = () => {
    if (interactive) {
      setActiveIndex(-1);
    }
  };
  
  const chartConfig = React.useMemo(() => {
    return data.reduce((acc, item, i) => {
      acc[item[index]] = {
        label: item[index],
        color: getColor(i),
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>);
  }, [data, index]);

  if (!data || data.length === 0) {
    return <EmptyDataDisplay text={emptyText} />;
  }

  return (
    <ChartContainer config={chartConfig} className={className}>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              nameKey={index}
              dataKey={category}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={80}
              fill="#8884d8"
              isAnimationActive={showAnimation}
              label={({ name, percent }) => 
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
              labelLine={true}
              activeIndex={activeIndex !== -1 ? activeIndex : undefined}
              activeShape={interactive ? renderActiveShape : undefined}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              className={`${interactive ? "cursor-pointer" : ""}`}
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
                      const percentage = (value * 100).toFixed(1);
                      return `${percentage}%`;
                    }
                    return valueFormatter(Number(value));
                  }}
                />
              )}
              wrapperStyle={{ outline: "none" }}
            />
            <Legend
              content={({ payload }) => (
                <ChartLegendContent payload={payload} nameKey={index} />
              )}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

// Donut Chart Component with enhanced functionality
export const DonutChart: React.FC<BaseChartProps> = ({
  data,
  index,
  categories,
  theme = "light",
  className,
  valueFormatter = (value) => `${value}`,
  showAnimation = false,
  height = 300,
  interactive = true,
  emptyText,
}) => {
  // Reuse the PieChart with an innerRadius to create a donut
  return (
    <PieChart
      data={data}
      index={index}
      categories={categories}
      theme={theme}
      className={className}
      valueFormatter={valueFormatter}
      showAnimation={showAnimation}
      height={height}
      innerRadius={60}
      interactive={interactive}
      emptyText={emptyText}
    />
  );
};
