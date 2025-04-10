import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ChartDataPoint {
  date: string;
  dayLabel: string;
  signalements: number;
  coupsDeCoeur: number;
  suggestions: number;
}

interface AnalyticsChartProps {
  data: ChartDataPoint[];
  visibleCurves: {
    signalements: boolean;
    coupsDeCoeur: boolean;
    suggestions: boolean;
  };
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, visibleCurves }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <XAxis dataKey="dayLabel" />
        <YAxis />
        <Tooltip />
        {visibleCurves.signalements && (
          <Area
            type="monotone"
            dataKey="signalements"
            stroke="#3BC9DB"
            fill="#E3FAFC"
            name="Signalements"
          />
        )}
        {visibleCurves.coupsDeCoeur && (
          <Area
            type="monotone"
            dataKey="coupsDeCoeur"
            stroke="#FF6B6B"
            fill="#FFE3E3"
            name="Coup de cœur"
          />
        )}
        {visibleCurves.suggestions && (
          <Area
            type="monotone"
            dataKey="suggestions"
            stroke="#FFA94D"
            fill="#FFF3E0"
            name="Suggestions"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AnalyticsChart;
