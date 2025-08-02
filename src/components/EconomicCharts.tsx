'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useEconomyStore } from '@/store/economyStore';

const EconomicCharts: React.FC = () => {
  const { history, macroIndicators, consumers, firms, banks } = useEconomyStore();

  // Prepare chart data from history
  const chartData = history.map((entry) => ({
    time: entry.time,
    gdp: entry.macroIndicators.gdp,
    inflation: entry.macroIndicators.inflation,
    unemployment: entry.macroIndicators.unemployment,
    interestRate: entry.macroIndicators.interestRate,
    governmentSpending: entry.macroIndicators.governmentSpending,
    taxRevenue: entry.macroIndicators.taxRevenue,
  }));

  // Current indicators for pie charts
  const gdpComposition = [
    { name: 'Consumption', value: consumers.reduce((sum, c) => sum + c.consumption, 0) },
    { name: 'Investment', value: firms.reduce((sum, f) => sum + f.capital, 0) },
    { name: 'Government', value: macroIndicators.governmentSpending },
    { name: 'Net Exports', value: macroIndicators.tradeBalance },
  ];

  const firmPerformance = firms.slice(0, 10).map((firm) => ({
    name: firm.id,
    revenue: firm.revenue,
    profit: firm.profit,
    employees: firm.employees,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(1);
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">Time: {label}</p>
          {payload.map((entry: { color: string; name: string; value: number }, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Macro Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Macroeconomic Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="gdp" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="gdp">GDP</TabsTrigger>
              <TabsTrigger value="inflation">Inflation</TabsTrigger>
              <TabsTrigger value="unemployment">Unemployment</TabsTrigger>
              <TabsTrigger value="interest">Interest Rate</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gdp" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="gdp" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="inflation" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="inflation" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="unemployment" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="unemployment" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="interest" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="interestRate" stroke="#ff7300" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* GDP Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>GDP Composition</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gdpComposition}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gdpComposition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Government Spending vs Tax Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Government Finance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="governmentSpending" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="taxRevenue" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Firm Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Firms Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={firmPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatNumber(value as number)} />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
              <Bar dataKey="profit" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Economic Health Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Economic Health Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {macroIndicators.gdp > 0 ? '✅' : '❌'}
              </div>
              <div className="text-sm font-medium">GDP Growth</div>
              <div className="text-xs text-gray-600">
                {macroIndicators.gdp > 0 ? 'Positive' : 'Negative'}
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {macroIndicators.inflation < 5 ? '✅' : '⚠️'}
              </div>
              <div className="text-sm font-medium">Inflation</div>
              <div className="text-xs text-gray-600">
                {macroIndicators.inflation < 5 ? 'Controlled' : 'High'}
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {macroIndicators.unemployment < 5 ? '✅' : '⚠️'}
              </div>
              <div className="text-sm font-medium">Employment</div>
              <div className="text-xs text-gray-600">
                {macroIndicators.unemployment < 5 ? 'Full' : 'High Unemployment'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EconomicCharts; 