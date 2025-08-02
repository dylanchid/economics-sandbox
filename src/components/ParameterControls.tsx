'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useEconomyStore } from '@/store/economyStore';
import { EconomicParameters } from '@/types/economy';

const ParameterControls: React.FC = () => {
  const { parameters, updateParameters } = useEconomyStore();

  const handleParameterChange = (key: keyof EconomicParameters, value: number[]) => {
    updateParameters({ [key]: value[0] });
  };

  const parameterConfigs = [
    {
      key: 'interestRate' as keyof EconomicParameters,
      label: 'Interest Rate',
      min: 0,
      max: 10,
      step: 0.1,
      unit: '%',
      description: 'Central bank interest rate affecting borrowing costs',
    },
    {
      key: 'taxRate' as keyof EconomicParameters,
      label: 'Tax Rate',
      min: 0,
      max: 50,
      step: 1,
      unit: '%',
      description: 'Overall tax rate affecting disposable income',
    },
    {
      key: 'governmentSpending' as keyof EconomicParameters,
      label: 'Government Spending',
      min: 0,
      max: 5000,
      step: 100,
      unit: 'M',
      description: 'Government expenditure on public services',
    },
    {
      key: 'populationGrowth' as keyof EconomicParameters,
      label: 'Population Growth',
      min: 0.5,
      max: 3,
      step: 0.1,
      unit: 'x',
      description: 'Population growth rate multiplier',
    },
    {
      key: 'techAdoption' as keyof EconomicParameters,
      label: 'Technology Adoption',
      min: 0,
      max: 1,
      step: 0.01,
      unit: '',
      description: 'Rate of technological advancement adoption',
    },
  ];

  const formatValue = (value: number, unit: string) => {
    if (unit === 'M') return `${(value / 1000).toFixed(1)}${unit}`;
    if (unit === 'x') return `${value.toFixed(1)}${unit}`;
    return `${value.toFixed(1)}${unit}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Economic Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {parameterConfigs.map((config) => (
              <div key={config.key} className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">{config.label}</label>
                  <span className="text-sm text-gray-600">
                    {formatValue(parameters[config.key], config.unit)}
                  </span>
                </div>
                <Slider
                  value={[parameters[config.key]]}
                  onValueChange={(value) => handleParameterChange(config.key, value)}
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">{config.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preset Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Preset Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => updateParameters({
                interestRate: 1.0,
                taxRate: 15,
                governmentSpending: 1500,
                populationGrowth: 1.5,
                techAdoption: 0.8,
              })}
              className="p-4 border rounded-lg hover:bg-gray-50 text-left"
            >
              <h3 className="font-semibold">Economic Boom</h3>
              <p className="text-sm text-gray-600">Low rates, high growth</p>
            </button>
            <button
              onClick={() => updateParameters({
                interestRate: 8.0,
                taxRate: 35,
                governmentSpending: 800,
                populationGrowth: 0.8,
                techAdoption: 0.2,
              })}
              className="p-4 border rounded-lg hover:bg-gray-50 text-left"
            >
              <h3 className="font-semibold">Recession</h3>
              <p className="text-sm text-gray-600">High rates, low growth</p>
            </button>
            <button
              onClick={() => updateParameters({
                interestRate: 2.5,
                taxRate: 25,
                governmentSpending: 1000,
                populationGrowth: 1.2,
                techAdoption: 0.5,
              })}
              className="p-4 border rounded-lg hover:bg-gray-50 text-left"
            >
              <h3 className="font-semibold">Balanced</h3>
              <p className="text-sm text-gray-600">Moderate settings</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParameterControls; 