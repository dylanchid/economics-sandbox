// Economic Entity Types
export interface Consumer {
  id: string;
  income: number;
  savings: number;
  consumption: number;
  debt: number;
  satisfaction: number;
  riskTolerance: number;
}

export interface Firm {
  id: string;
  revenue: number;
  costs: number;
  profit: number;
  employees: number;
  capital: number;
  productivity: number;
  marketShare: number;
}

export interface Bank {
  id: string;
  deposits: number;
  loans: number;
  reserves: number;
  interestRate: number;
  profit: number;
}

// Macroeconomic Indicators
export interface MacroIndicators {
  gdp: number;
  inflation: number;
  unemployment: number;
  interestRate: number;
  moneySupply: number;
  governmentSpending: number;
  taxRevenue: number;
  tradeBalance: number;
}

// Economic Parameters (User Customizable)
export interface EconomicParameters {
  interestRate: number;
  taxRate: number;
  governmentSpending: number;
  populationGrowth: number;
  techAdoption: number;
}

// Simulation State
export interface SimulationState {
  time: number;
  isRunning: boolean;
  speed: 'real-time' | 'step-by-step' | 'fast-forward';
  stepSize: number;
  consumers: Consumer[];
  firms: Firm[];
  banks: Bank[];
  macroIndicators: MacroIndicators;
  parameters: EconomicParameters;
  history: {
    time: number;
    macroIndicators: MacroIndicators;
    parameters: EconomicParameters;
  }[];
}

// Chart Data Types
export interface ChartDataPoint {
  time: number;
  value: number;
  label: string;
}

export interface ChartData {
  gdp: ChartDataPoint[];
  inflation: ChartDataPoint[];
  unemployment: ChartDataPoint[];
  interestRate: ChartDataPoint[];
  governmentSpending: ChartDataPoint[];
  taxRevenue: ChartDataPoint[];
}

// Simulation Events
export interface EconomicEvent {
  id: string;
  type: 'policy-change' | 'market-shock' | 'technological-breakthrough';
  description: string;
  impact: Partial<EconomicParameters>;
  timestamp: number;
} 