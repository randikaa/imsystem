'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const productionData = [
  { month: 'Jan', production: 4000, target: 3800, efficiency: 85 },
  { month: 'Feb', production: 3000, target: 3200, efficiency: 78 },
  { month: 'Mar', production: 5000, target: 4500, efficiency: 92 },
  { month: 'Apr', production: 4500, target: 4200, efficiency: 88 },
  { month: 'May', production: 6000, target: 5500, efficiency: 95 },
  { month: 'Jun', production: 5500, target: 5200, efficiency: 90 },
];

const categoryData = [
  { category: 'Electronics', value: 4500 },
  { category: 'Accessories', value: 3200 },
  { category: 'Furniture', value: 2800 },
  { category: 'Clothing', value: 3600 },
  { category: 'Food', value: 2100 },
];

export function ProductionAnalysis() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Production Analysis</h2>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Production vs Target Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Production vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="production" 
                  stroke="#2D1B4E" 
                  strokeWidth={2}
                  dot={{ fill: '#2D1B4E', r: 4 }}
                  name="Production"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Production Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Production Efficiency (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="efficiency" 
                  fill="#2D1B4E" 
                  radius={[8, 8, 0, 0]}
                  name="Efficiency %"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <YAxis 
                  type="category" 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#8b5cf6" 
                  radius={[0, 8, 8, 0]}
                  name="Units Produced"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Production Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Production Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="text-sm text-gray-600">Total Production</p>
                  <p className="text-2xl font-bold">28,000 units</p>
                </div>
                <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  +12.5%
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="text-sm text-gray-600">Average Efficiency</p>
                  <p className="text-2xl font-bold">88%</p>
                </div>
                <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  +5.2%
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="text-sm text-gray-600">Target Achievement</p>
                  <p className="text-2xl font-bold">94%</p>
                </div>
                <div className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                  +8.1%
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Defect Rate</p>
                  <p className="text-2xl font-bold">2.3%</p>
                </div>
                <div className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                  -1.2%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
