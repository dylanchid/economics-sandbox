'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEconomyStore } from '@/store/economyStore';

const EntityList: React.FC = () => {
  const { consumers, firms, banks } = useEconomyStore();

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(1);
  };

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="consumers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="consumers">Consumers ({consumers.length})</TabsTrigger>
          <TabsTrigger value="firms">Firms ({firms.length})</TabsTrigger>
          <TabsTrigger value="banks">Banks ({banks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="consumers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Consumer Population</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {consumers.slice(0, 12).map((consumer) => (
                  <div key={consumer.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <h3 className="font-semibold text-sm mb-2">{consumer.id}</h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Income:</span>
                        <span className="font-medium">${formatNumber(consumer.income)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Consumption:</span>
                        <span className="font-medium">${formatNumber(consumer.consumption)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Savings:</span>
                        <span className="font-medium">${formatNumber(consumer.savings)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Debt:</span>
                        <span className="font-medium">${formatNumber(consumer.debt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Satisfaction:</span>
                        <span className="font-medium">{formatPercentage(consumer.satisfaction * 100)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {consumers.length > 12 && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  Showing 12 of {consumers.length} consumers
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="firms" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Firms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {firms.map((firm) => (
                  <div key={firm.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <h3 className="font-semibold text-sm mb-2">{firm.id}</h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="font-medium">${formatNumber(firm.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit:</span>
                        <span className={`font-medium ${firm.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${formatNumber(firm.profit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Employees:</span>
                        <span className="font-medium">{firm.employees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Capital:</span>
                        <span className="font-medium">${formatNumber(firm.capital)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Productivity:</span>
                        <span className="font-medium">{formatPercentage(firm.productivity * 100)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Market Share:</span>
                        <span className="font-medium">{formatPercentage(firm.marketShare * 100)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Institutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banks.map((bank) => (
                  <div key={bank.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <h3 className="font-semibold text-sm mb-2">{bank.id}</h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Deposits:</span>
                        <span className="font-medium">${formatNumber(bank.deposits)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Loans:</span>
                        <span className="font-medium">${formatNumber(bank.loans)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reserves:</span>
                        <span className="font-medium">${formatNumber(bank.reserves)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span className="font-medium">{formatPercentage(bank.interestRate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit:</span>
                        <span className={`font-medium ${bank.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${formatNumber(bank.profit)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Economic Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Consumers</h3>
              <div className="space-y-1 text-sm">
                <div>Total: {consumers.length}</div>
                <div>Avg Income: ${formatNumber(consumers.reduce((sum, c) => sum + c.income, 0) / consumers.length)}</div>
                <div>Total Consumption: ${formatNumber(consumers.reduce((sum, c) => sum + c.consumption, 0))}</div>
                <div>Total Savings: ${formatNumber(consumers.reduce((sum, c) => sum + c.savings, 0))}</div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Firms</h3>
              <div className="space-y-1 text-sm">
                <div>Total: {firms.length}</div>
                <div>Total Revenue: ${formatNumber(firms.reduce((sum, f) => sum + f.revenue, 0))}</div>
                <div>Total Profit: ${formatNumber(firms.reduce((sum, f) => sum + f.profit, 0))}</div>
                <div>Total Employees: {firms.reduce((sum, f) => sum + f.employees, 0)}</div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Banks</h3>
              <div className="space-y-1 text-sm">
                <div>Total: {banks.length}</div>
                <div>Total Deposits: ${formatNumber(banks.reduce((sum, b) => sum + b.deposits, 0))}</div>
                <div>Total Loans: ${formatNumber(banks.reduce((sum, b) => sum + b.loans, 0))}</div>
                <div>Total Profit: ${formatNumber(banks.reduce((sum, b) => sum + b.profit, 0))}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntityList; 