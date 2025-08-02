'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Info, TrendingUp, Settings, Users, BarChart3, Lightbulb, AlertCircle } from 'lucide-react';
import { useEconomyStore } from '@/store/economyStore';

interface ContextualSidebarProps {
  activeTab: string;
}

const ContextualSidebar: React.FC<ContextualSidebarProps> = ({ activeTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { macroIndicators, parameters, consumers, firms, banks, isRunning, time } = useEconomyStore();

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(1);
  };

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const getSidebarContent = () => {
    switch (activeTab) {
      case 'charts':
        return {
          title: 'Charts & Analytics',
          icon: <BarChart3 className="w-5 h-5" />,
          description: 'Visualize economic trends and performance metrics',
          tips: [
            'Use the tabs to switch between different economic indicators',
            'Hover over chart points for detailed values',
            'The GDP composition shows the breakdown of economic activity',
            'Monitor the economic health indicators for overall status'
          ],
          insights: [
            {
              label: 'GDP Trend',
              value: macroIndicators.gdp > 0 ? 'Growing' : 'Declining',
              status: macroIndicators.gdp > 0 ? 'positive' : 'negative'
            },
            {
              label: 'Inflation Status',
              value: macroIndicators.inflation < 3 ? 'Low' : macroIndicators.inflation < 5 ? 'Moderate' : 'High',
              status: macroIndicators.inflation < 5 ? 'positive' : 'warning'
            },
            {
              label: 'Employment',
              value: macroIndicators.unemployment < 5 ? 'Full' : 'High Unemployment',
              status: macroIndicators.unemployment < 5 ? 'positive' : 'warning'
            }
          ]
        };

      case 'parameters':
        return {
          title: 'Economic Parameters',
          icon: <Settings className="w-5 h-5" />,
          description: 'Adjust economic policy parameters and see their effects',
          tips: [
            'Interest rates affect borrowing costs and investment',
            'Tax rates impact disposable income and government revenue',
            'Government spending stimulates economic activity',
            'Population growth affects labor supply and consumption',
            'Technology adoption drives productivity improvements'
          ],
          insights: [
            {
              label: 'Current Interest Rate',
              value: `${parameters.interestRate.toFixed(1)}%`,
              status: parameters.interestRate < 3 ? 'positive' : parameters.interestRate < 6 ? 'neutral' : 'warning'
            },
            {
              label: 'Tax Rate',
              value: `${parameters.taxRate.toFixed(1)}%`,
              status: parameters.taxRate < 20 ? 'positive' : parameters.taxRate < 35 ? 'neutral' : 'warning'
            },
            {
              label: 'Government Spending',
              value: `$${formatNumber(parameters.governmentSpending)}M`,
              status: parameters.governmentSpending > 1000 ? 'positive' : 'neutral'
            }
          ]
        };

      case 'entities':
        return {
          title: 'Economic Entities',
          icon: <Users className="w-5 h-5" />,
          description: 'Monitor individual economic agents and their behavior',
          tips: [
            'Consumers drive demand through consumption',
            'Firms create supply and employment opportunities',
            'Banks facilitate financial intermediation',
            'Monitor entity health for economic stability',
            'Individual behavior aggregates to macro outcomes'
          ],
          insights: [
            {
              label: 'Total Consumers',
              value: consumers.length.toString(),
              status: 'neutral'
            },
            {
              label: 'Total Firms',
              value: firms.length.toString(),
              status: 'neutral'
            },
            {
              label: 'Total Banks',
              value: banks.length.toString(),
              status: 'neutral'
            },
            {
              label: 'Avg Consumer Income',
              value: `$${formatNumber(consumers.reduce((sum, c) => sum + c.income, 0) / consumers.length)}`,
              status: 'neutral'
            }
          ]
        };

      default:
        return {
          title: 'Dashboard Overview',
          icon: <TrendingUp className="w-5 h-5" />,
          description: 'Monitor overall economic performance and simulation status',
          tips: [
            'Use the simulation controls to start, pause, or reset',
            'Adjust simulation speed to observe changes',
            'Monitor macro indicators for economic health',
            'Switch between tabs for detailed analysis'
          ],
          insights: [
            {
              label: 'Simulation Status',
              value: isRunning ? 'Running' : 'Paused',
              status: isRunning ? 'positive' : 'neutral'
            },
            {
              label: 'Current GDP',
              value: `$${formatNumber(macroIndicators.gdp)}M`,
              status: macroIndicators.gdp > 0 ? 'positive' : 'negative'
            },
            {
              label: 'Inflation Rate',
              value: formatPercentage(macroIndicators.inflation),
              status: macroIndicators.inflation < 3 ? 'positive' : macroIndicators.inflation < 5 ? 'neutral' : 'warning'
            }
          ]
        };
    }
  };

  const content = getSidebarContent();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (isCollapsed) {
    return (
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
        <Button
          onClick={() => setIsCollapsed(false)}
          variant="outline"
          size="sm"
          className="rounded-l-lg rounded-r-none border-r-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-40 overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {content.icon}
            <h2 className="text-lg font-semibold">{content.title}</h2>
          </div>
          <Button
            onClick={() => setIsCollapsed(true)}
            variant="ghost"
            size="sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Description */}
        <Card className="mb-4">
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600">{content.description}</p>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Info className="w-4 h-4" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {content.insights.map((insight, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{insight.label}:</span>
                  <span className={`font-medium ${getStatusColor(insight.status)}`}>
                    {insight.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Helpful Tips */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Helpful Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {content.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-600">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Warnings/Notes */}
        {activeTab === 'parameters' && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Parameter Effects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <p className="text-yellow-800">
                    <strong>High Interest Rates:</strong> May reduce investment and consumption
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                  <p className="text-blue-800">
                    <strong>High Government Spending:</strong> Stimulates economy but may increase debt
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                  <p className="text-green-800">
                    <strong>Technology Adoption:</strong> Improves productivity and economic growth
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Simulation Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Simulation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-medium ${isRunning ? 'text-green-600' : 'text-gray-600'}`}>
                  {isRunning ? 'Running' : 'Paused'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Time Period:</span>
                <span className="font-medium">{time || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Speed:</span>
                <span className="font-medium">Real-time</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContextualSidebar; 