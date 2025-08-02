import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  SimulationState,
  EconomicParameters,
  MacroIndicators,
  Consumer,
  Firm,
  Bank,
  EconomicEvent,
} from '@/types/economy';

interface EconomyStore extends SimulationState {
  // Actions
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  updateParameters: (params: Partial<EconomicParameters>) => void;
  setSpeed: (speed: 'real-time' | 'step-by-step' | 'fast-forward') => void;
  stepSimulation: () => void;
  addEvent: (event: EconomicEvent) => void;
  
  // Economic calculations
  calculateMacroIndicators: () => void;
  updateEntities: () => void;
  applyPolicyChanges: () => void;
}

const initialParameters: EconomicParameters = {
  interestRate: 2.5,
  taxRate: 25,
  governmentSpending: 1000,
  populationGrowth: 1.2,
  techAdoption: 0.5,
};

const initialMacroIndicators: MacroIndicators = {
  gdp: 20000,
  inflation: 2.0,
  unemployment: 5.0,
  interestRate: 2.5,
  moneySupply: 5000,
  governmentSpending: 1000,
  taxRevenue: 5000,
  tradeBalance: 0,
};

const generateInitialEntities = () => {
  const consumers: Consumer[] = Array.from({ length: 100 }, (_, i) => ({
    id: `consumer-${i}`,
    income: 50000 + Math.random() * 50000,
    savings: 10000 + Math.random() * 20000,
    consumption: 40000 + Math.random() * 30000,
    debt: Math.random() * 50000,
    satisfaction: 0.7 + Math.random() * 0.3,
    riskTolerance: Math.random(),
  }));

  const firms: Firm[] = Array.from({ length: 20 }, (_, i) => ({
    id: `firm-${i}`,
    revenue: 1000000 + Math.random() * 5000000,
    costs: 800000 + Math.random() * 4000000,
    profit: 200000 + Math.random() * 1000000,
    employees: 50 + Math.floor(Math.random() * 200),
    capital: 500000 + Math.random() * 2000000,
    productivity: 0.8 + Math.random() * 0.4,
    marketShare: Math.random() * 0.1,
  }));

  const banks: Bank[] = Array.from({ length: 5 }, (_, i) => ({
    id: `bank-${i}`,
    deposits: 10000000 + Math.random() * 50000000,
    loans: 8000000 + Math.random() * 40000000,
    reserves: 2000000 + Math.random() * 10000000,
    interestRate: 2.5 + Math.random() * 2,
    profit: 500000 + Math.random() * 2000000,
  }));

  return { consumers, firms, banks };
};

export const useEconomyStore = create<EconomyStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      time: 0,
      isRunning: false,
      speed: 'real-time',
      stepSize: 1,
      ...generateInitialEntities(),
      macroIndicators: initialMacroIndicators,
      parameters: initialParameters,
      history: [],

      // Actions
      startSimulation: () => {
        set({ isRunning: true });
        const interval = setInterval(() => {
          const { isRunning, speed } = get();
          if (!isRunning) {
            clearInterval(interval);
            return;
          }
          
          if (speed === 'real-time') {
            get().stepSimulation();
          }
        }, 1000);
      },

      pauseSimulation: () => set({ isRunning: false }),

      resetSimulation: () => {
        const { consumers, firms, banks } = generateInitialEntities();
        set({
          time: 0,
          isRunning: false,
          consumers,
          firms,
          banks,
          macroIndicators: initialMacroIndicators,
          parameters: initialParameters,
          history: [],
        });
      },

      updateParameters: (params) => {
        set((state) => ({
          parameters: { ...state.parameters, ...params },
        }));
        get().calculateMacroIndicators();
      },

      setSpeed: (speed) => set({ speed }),

      stepSimulation: () => {
        const state = get();
        set((prev) => ({ time: prev.time + prev.stepSize }));
        get().updateEntities();
        get().calculateMacroIndicators();
        get().applyPolicyChanges();
        
        // Save to history
        const currentState = get();
        set((prev) => ({
          history: [
            ...prev.history,
            {
              time: currentState.time,
              macroIndicators: currentState.macroIndicators,
              parameters: currentState.parameters,
            },
          ],
        }));
      },

      addEvent: (event) => {
        // Apply event impact to parameters
        const state = get();
        const newParameters = { ...state.parameters, ...event.impact };
        set({ parameters: newParameters });
        get().calculateMacroIndicators();
      },

      // Economic calculations
      calculateMacroIndicators: () => {
        const state = get();
        const { consumers, firms, banks, parameters } = state;

        // Calculate GDP (Consumption + Investment + Government Spending + Net Exports)
        const totalConsumption = consumers.reduce((sum, c) => sum + c.consumption, 0);
        const totalInvestment = firms.reduce((sum, f) => sum + f.capital, 0);
        const netExports = state.macroIndicators.tradeBalance;
        const gdp = totalConsumption + totalInvestment + parameters.governmentSpending + netExports;

        // Calculate inflation (simplified)
        const inflation = Math.max(0, 2 + (parameters.interestRate - 2.5) * 0.5);

        // Calculate unemployment
        const totalWorkers = consumers.length;
        const employedWorkers = firms.reduce((sum, f) => sum + f.employees, 0);
        const unemployment = Math.max(0, ((totalWorkers - employedWorkers) / totalWorkers) * 100);

        // Calculate money supply
        const moneySupply = banks.reduce((sum, b) => sum + b.deposits, 0);

        // Calculate tax revenue
        const taxRevenue = (totalConsumption + totalInvestment) * (parameters.taxRate / 100);

        set({
          macroIndicators: {
            gdp,
            inflation,
            unemployment,
            interestRate: parameters.interestRate,
            moneySupply,
            governmentSpending: parameters.governmentSpending,
            taxRevenue,
            tradeBalance: netExports,
          },
        });
      },

      updateEntities: () => {
        const state = get();
        const { parameters } = state;

        // Update consumers
        const updatedConsumers = state.consumers.map((consumer) => {
          const incomeGrowth = 1 + (parameters.techAdoption * 0.02);
          const consumptionGrowth = 1 + (parameters.interestRate < 3 ? 0.02 : -0.01);
          
          return {
            ...consumer,
            income: consumer.income * incomeGrowth,
            consumption: consumer.consumption * consumptionGrowth,
            savings: consumer.savings * (1 + parameters.interestRate / 100),
          };
        });

        // Update firms
        const updatedFirms = state.firms.map((firm) => {
          const productivityGrowth = 1 + (parameters.techAdoption * 0.05);
          const costGrowth = 1 + (parameters.inflation / 100);
          
          return {
            ...firm,
            revenue: firm.revenue * productivityGrowth,
            costs: firm.costs * costGrowth,
            profit: firm.revenue * productivityGrowth - firm.costs * costGrowth,
            productivity: firm.productivity * productivityGrowth,
          };
        });

        // Update banks
        const updatedBanks = state.banks.map((bank) => ({
          ...bank,
          interestRate: parameters.interestRate + Math.random() * 0.5,
          profit: bank.loans * (bank.interestRate / 100) - bank.deposits * 0.5,
        }));

        set({
          consumers: updatedConsumers,
          firms: updatedFirms,
          banks: updatedBanks,
        });
      },

      applyPolicyChanges: () => {
        const state = get();
        const { parameters } = state;

        // Apply population growth
        if (parameters.populationGrowth > 1) {
          const newConsumers = Array.from({ length: Math.floor(parameters.populationGrowth) }, (_, i) => ({
            id: `consumer-${state.consumers.length + i}`,
            income: 50000 + Math.random() * 50000,
            savings: 10000 + Math.random() * 20000,
            consumption: 40000 + Math.random() * 30000,
            debt: Math.random() * 50000,
            satisfaction: 0.7 + Math.random() * 0.3,
            riskTolerance: Math.random(),
          }));
          
          set((prev) => ({
            consumers: [...prev.consumers, ...newConsumers],
          }));
        }
      },
    }),
    {
      name: 'economy-store',
    }
  )
); 