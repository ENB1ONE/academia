import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const mockData = [
  { subject: 'Sono', value: 4, fullMark: 5 },
  { subject: 'Fadiga', value: 3, fullMark: 5 },
  { subject: 'Dor', value: 2, fullMark: 5 },
  { subject: 'Estresse', value: 4, fullMark: 5 },
  { subject: 'Humor', value: 5, fullMark: 5 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-gray-700 p-2 rounded-lg shadow-xl">
        <p className="text-text font-bold">{payload[0].payload.subject}: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const WellnessChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockData}>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6B7280' }} />
        <Radar
          name="Bem-Estar"
          dataKey="value"
          stroke="#7C3AED"
          fill="#7C3AED"
          fillOpacity={0.5}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default WellnessChart;
