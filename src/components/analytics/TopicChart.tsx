'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TopicData {
  topic: string;
  accuracy: number;
  questionsAttempted: number;
}

interface TopicChartProps {
  data: TopicData[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export function TopicChart({ data }: TopicChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Topic Performance</h3>
        <p className="text-gray-500 text-center py-8">
          No topic data available yet.
        </p>
      </div>
    );
  }

  // Sort data by topic number first
  const sortedData = [...data].sort((a, b) => {
    // Extract topic numbers for sorting (assumes format like "Topic 1: ...")
    const getTopicNumber = (topic: string) => {
      const match = topic.match(/Topic (\d+)/i);
      return match ? parseInt(match[1]) : 999;
    };
    return getTopicNumber(a.topic) - getTopicNumber(b.topic);
  });

  // Prepare data for bar chart
  const chartData = sortedData.map((item, index) => {
    // Extract just "Topic X" from the full topic name
    const topicMatch = item.topic.match(/Topic \d+/i);
    const shortTopic = topicMatch ? topicMatch[0] : `Topic ${index + 1}`;
    
    return {
      topic: shortTopic,
      fullTopic: item.topic,
      accuracy: item.accuracy,
      questionsAttempted: item.questionsAttempted,
      color: COLORS[index % COLORS.length]
    };
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{data.fullTopic}</p>
          <p className="text-blue-600">Accuracy: {data.accuracy}%</p>
          <p className="text-gray-600">Questions: {data.questionsAttempted}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Topic Performance</h3>
      
      {/* Bar Chart */}
      <div style={{ width: '100%', height: '300px' }} className="mb-6">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="topic" 
              height={60}
              interval={0}
            />
            <YAxis 
              label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Topic Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedData.map((topic, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4" style={{ borderLeftColor: COLORS[index % COLORS.length] }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">{topic.topic}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{topic.questionsAttempted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className={`font-medium ${
                      topic.accuracy >= 80 ? 'text-green-600' :
                      topic.accuracy >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {topic.accuracy}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress bar for accuracy */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    topic.accuracy >= 80 ? 'bg-green-500' :
                    topic.accuracy >= 60 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${topic.accuracy}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}