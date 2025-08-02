'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEconomyStore } from '@/store/economyStore';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import ParameterControls from './ParameterControls';
import EconomicCharts from './EconomicCharts';
import EntityList from './EntityList';
import ContextualSidebar from './ContextualSidebar';

const EconomyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('charts');
  const {
    time,
    isRunning,
    speed,
    macroIndicators,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setSpeed,
    stepSimulation,
  } = useEconomyStore();

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(1);
  };

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${activeTab ? 'pr-80' : ''}`}>
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Economy Sandbox
                </h1>
                <p className="text-gray-600">
                  Interactive economic simulation with real-time visualization
                </p>
              </div>

              {/* Simulation Controls */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Simulation Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={isRunning ? pauseSimulation : startSimulation}
                        variant={isRunning ? 'destructive' : 'default'}
                      >
                        {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isRunning ? 'Pause' : 'Start'}
                      </Button>
                      <Button onClick={resetSimulation} variant="outline">
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </Button>
                      <Button onClick={stepSimulation} variant="outline">
                        <SkipForward className="w-4 h-4" />
                        Step
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Speed:</span>
                      <select
                        value={speed}
                        onChange={(e) => setSpeed(e.target.value as 'real-time' | 'step-by-step' | 'fast-forward')}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="real-time">Real-time</option>
                        <option value="step-by-step">Step-by-step</option>
                        <option value="fast-forward">Fast-forward</option>
                      </select>
                    </div>
                    <div className="text-sm text-gray-600">
                      Time: {time} periods
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Macro Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">GDP</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${formatNumber(macroIndicators.gdp)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Inflation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatPercentage(macroIndicators.inflation)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Unemployment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatPercentage(macroIndicators.unemployment)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Interest Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatPercentage(macroIndicators.interestRate)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Tabs */}
              <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="charts">Charts & Analytics</TabsTrigger>
                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                  <TabsTrigger value="entities">Economic Entities</TabsTrigger>
                </TabsList>

                <TabsContent value="charts" className="space-y-4">
                  <EconomicCharts />
                </TabsContent>

                <TabsContent value="parameters" className="space-y-4">
                  <ParameterControls />
                </TabsContent>

                <TabsContent value="entities" className="space-y-4">
                  <EntityList />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Contextual Sidebar */}
        <ContextualSidebar activeTab={activeTab} />
      </div>
    </div>
  );
};

export default EconomyDashboard; 