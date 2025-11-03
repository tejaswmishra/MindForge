'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PerformanceData {
  date: string;
  accuracy: number;
  quizzesAttempted: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
        <p className="text-gray-500 text-center py-8">
          No quiz data yet. Take some quizzes to see your progress!
        </p>
      </div>
    );
  }

  // Format data for charts
  const chartData = data.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
      
      {/* Accuracy Line Chart */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-700 mb-3">Accuracy Trend</h4>
        <div style={{ width: '100%', height: '200px' }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                domain={[0, 100]}
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, 'Accuracy']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Questions Attempted Bar Chart */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-3">Questions Attempted</h4>
        <div style={{ width: '100%', height: '200px' }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate"
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value}`, 'Questions']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar 
                dataKey="quizzesAttempted" 
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}