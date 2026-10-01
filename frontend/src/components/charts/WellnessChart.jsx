import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

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

const WellnessChart = ({ data }) => {
  // Use the most recent record, or empty
  const latest = data && data.length > 0 ? data[0] : null;

  const chartData = latest ? [
    { subject: 'Sono', value: latest.sleep_quality, fullMark: 5 },
    { subject: 'Fadiga', value: latest.fatigue_level, fullMark: 5 },
    { subject: 'Dor', value: latest.muscle_soreness, fullMark: 5 },
    { subject: 'Estresse', value: latest.stress_level, fullMark: 5 },
    { subject: 'Humor', value: latest.mood, fullMark: 5 },
  ] : [];

  if (!latest) {
    return <div className="flex items-center justify-center h-full text-gray-500">Sem dados recentes</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6B7280' }} />
        <Radar
          name="Bem-Estar Atual"
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
