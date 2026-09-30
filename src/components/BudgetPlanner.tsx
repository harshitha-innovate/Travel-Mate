import React, { useState } from 'react';
import { TripPlan, BudgetOptimizationSuggestion, WhatIfSimulation } from '../types/travel';
import { DollarSign, TrendingDown, Sparkles, Loader2, Check, ArrowRight, RefreshCw, AlertCircle, Sliders, ShieldAlert } from 'lucide-react';
import { optimizeBudgetAI, simulateWhatIfAI } from '../services/api';

interface BudgetPlannerProps {
  trip: TripPlan;
  onApplyOptimizedBudget: (savings: number, newTotal: number, newBreakdown: any) => void;
  onApplyWhatIfScenario: (newBudget: number, newBreakdown?: any) => void;
}

export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({
  trip,
  onApplyOptimizedBudget,
  onApplyWhatIfScenario,
}) => {
  const { budgetBreakdown, budget, currency, travelers, durationDays, expenses } = trip;

  // Real code calculations
  const totalSpent = (expenses || []).reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const remainingBudget = budget - totalSpent;
  const costPerPerson = Math.round(budget / Math.max(1, travelers));
  const costPerDay = Math.round(budget / Math.max(1, durationDays));

  // AI Budget Optimization states
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<{
    totalPotentialSavings: number;
    newEstimatedCost: number;
    suggestions: BudgetOptimizationSuggestion[];
    revisedBreakdown: any;
  } | null>(null);

  // What-If Simulator states
  const [targetBudget, setTargetBudget] = useState(25000);
  const [targetTravelers, setTargetTravelers] = useState(travelers);
  const [targetHotel, setTargetHotel] = useState(trip.hotelPreference);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<(WhatIfSimulation & { revisedBreakdown?: any }) | null>(null);

  const handleRunOptimization = async () => {
    setIsOptimizing(true);
    try {
      const result = await optimizeBudgetAI(trip);
      setOptimizationResult(result);
    } catch (err) {
      console.error('Failed to optimize budget:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleRunSimulation = async (customBudget?: number) => {
    setIsSimulating(true);
    const chosenBudget = customBudget !== undefined ? customBudget : targetBudget;
    try {
      const result = await simulateWhatIfAI(trip, {
        targetBudget: chosenBudget,
        targetTravelers,
        targetHotel,
      });
      setSimulationResult(result);
    } catch (err) {
      console.error('Failed simulation:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Budget Planner & What-If Simulator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Calculated mathematical allocations, Gemini AI financial optimizer, and scenario simulator.
          </p>
        </div>

        <button
          onClick={handleRunOptimization}
          disabled={isOptimizing}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Reductions...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Optimize My Budget with AI</span>
            </>
          )}
        </button>
      </div>

      {/* Main Stats Metric Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Total Allocated</span>
          <p className="text-xl font-black text-slate-900">{currency}{budget.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Logged Spending</span>
          <p className="text-xl font-black text-amber-600">{currency}{totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Remaining Budget</span>
          <p className="text-xl font-black text-emerald-600">{currency}{remainingBudget.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Per Person ({travelers} pax)</span>
          <p className="text-xl font-black text-slate-900">{currency}{costPerPerson.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-500 font-medium">Per Day ({durationDays} days)</span>
          <p className="text-xl font-black text-slate-900">{currency}{costPerDay.toLocaleString()}</p>
        </div>
      </div>

      {/* Itemized Budget Allocation Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Allocated Budget Categories Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Balanced across lodging, transit, dining, activities, and reserve buffer.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-900">
            Total: {currency}{budget.toLocaleString()}
          </span>
        </div>

        {/* Visual Allocation Bar */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
            <div style={{ width: `${(budgetBreakdown.hotel / budget) * 100}%` }} className="bg-teal-600" title="Hotel" />
            <div style={{ width: `${(budgetBreakdown.transport / budget) * 100}%` }} className="bg-sky-500" title="Transport" />
            <div style={{ width: `${(budgetBreakdown.food / budget) * 100}%` }} className="bg-amber-500" title="Food" />
            <div style={{ width: `${(budgetBreakdown.activities / budget) * 100}%` }} className="bg-emerald-500" title="Activities" />
            <div style={{ width: `${(budgetBreakdown.shopping / budget) * 100}%` }} className="bg-indigo-500" title="Shopping" />
            <div style={{ width: `${((budgetBreakdown.emergencyBuffer || 0) / budget) * 100}%` }} className="bg-rose-400" title="Emergency" />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Hotel ({Math.round((budgetBreakdown.hotel / budget) * 100)}%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Transport ({Math.round((budgetBreakdown.transport / budget) * 100)}%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Food ({Math.round((budgetBreakdown.food / budget) * 100)}%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Activities ({Math.round((budgetBreakdown.activities / budget) * 100)}%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Shopping ({Math.round((budgetBreakdown.shopping / budget) * 100)}%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Emergency ({Math.round(((budgetBreakdown.emergencyBuffer || 0) / budget) * 100)}%)</span>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-500 font-medium">Hotel Lodging</span>
            <p className="font-bold text-slate-900 text-sm">{currency}{budgetBreakdown.hotel.toLocaleString()}</p>
            <span className="text-[10px] text-slate-400">{Math.round((budgetBreakdown.hotel / budget) * 100)}% of total</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-500 font-medium">Transport / Cabs</span>
            <p className="font-bold text-slate-900 text-sm">{currency}{budgetBreakdown.transport.toLocaleString()}</p>
            <span className="text-[10px] text-slate-400">{Math.round((budgetBreakdown.transport / budget) * 100)}% of total</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-500 font-medium">Food & Dining</span>
            <p className="font-bold text-slate-900 text-sm">{currency}{budgetBreakdown.food.toLocaleString()}</p>
            <span className="text-[10px] text-slate-400">{Math.round((budgetBreakdown.food / budget) * 100)}% of total</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-500 font-medium">Entry & Activities</span>
            <p className="font-bold text-slate-900 text-sm">{currency}{budgetBreakdown.activities.toLocaleString()}</p>
            <span className="text-[10px] text-slate-400">{Math.round((budgetBreakdown.activities / budget) * 100)}% of total</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-500 font-medium">Shopping & Souvenirs</span>
            <p className="font-bold text-slate-900 text-sm">{currency}{budgetBreakdown.shopping.toLocaleString()}</p>
            <span className="text-[10px] text-slate-400">{Math.round((budgetBreakdown.shopping / budget) * 100)}% of total</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-500 font-medium">Emergency Buffer</span>
            <p className="font-bold text-slate-900 text-sm">{currency}{(budgetBreakdown.emergencyBuffer || 3000).toLocaleString()}</p>
            <span className="text-[10px] text-slate-400">Contingency reserve</span>
          </div>
        </div>
      </div>

      {/* AI Budget Optimization Result Card (Section 14) */}
      {optimizationResult && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/80 pb-3">
            <div>
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" /> GEMINI AI BUDGET OPTIMIZER SUGGESTIONS
              </span>
              <h3 className="text-lg font-extrabold text-emerald-950">
                Potential Savings: {currency}{optimizationResult.totalPotentialSavings.toLocaleString()}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-700 block">New Estimated Cost</span>
              <span className="text-xl font-black text-emerald-950">
                {currency}{optimizationResult.newEstimatedCost.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {optimizationResult.suggestions.map((sug, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-emerald-100 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold capitalize text-slate-900">{sug.title}</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Save {currency}{sug.savings.toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{sug.description}</p>
                <div className="pt-2 text-[11px] font-semibold text-teal-800 border-t border-slate-100">
                  Action: {sug.actionableStep}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Does not alter itinerary without confirmation.
            </span>
            <button
              onClick={() =>
                onApplyOptimizedBudget(
                  optimizationResult.totalPotentialSavings,
                  optimizationResult.newEstimatedCost,
                  optimizationResult.revisedBreakdown
                )
              }
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply Changes ({currency}{optimizationResult.newEstimatedCost.toLocaleString()})</span>
            </button>
          </div>
        </div>
      )}

      {/* "What-If" Trip Simulator Section (Section 15) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-teal-600" />
              "What-If?" Scenario Simulator
            </h2>
            <p className="text-xs text-slate-500">
              Simulate budget cuts, extra travelers, or hotel tier shifts and see instant trade-offs.
            </p>
          </div>

          {/* Demonstration Quick Trigger: "What if my budget becomes ₹25,000?" */}
          <button
            onClick={() => {
              setTargetBudget(25000);
              handleRunSimulation(25000);
            }}
            className="text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Demo Scenario: "What if budget becomes ₹25,000?"
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Simulate New Budget ({currency})
            </label>
            <input
              type="number"
              step={1000}
              value={targetBudget}
              onChange={(e) => setTargetBudget(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:bg-white focus:outline-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Number of Travelers
            </label>
            <input
              type="number"
              min={1}
              max={15}
              value={targetTravelers}
              onChange={(e) => setTargetTravelers(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:bg-white focus:outline-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Simulate Hotel Tier
            </label>
            <select
              value={targetHotel}
              onChange={(e) => setTargetHotel(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
            >
              <option value="budget">Budget Lodging</option>
              <option value="3-star">3 Star Hotel</option>
              <option value="4-star">4 Star Hotel</option>
              <option value="5-star">5 Star Luxury</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => handleRunSimulation()}
            disabled={isSimulating}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating Scenario...</span>
              </>
            ) : (
              <>
                <span>Run What-If Simulation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Simulation Output Comparison */}
        {simulationResult && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-xs animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <span className="font-bold text-slate-900 text-sm">
                Scenario Comparison: {simulationResult.changeSummary}
              </span>
              <span className={`font-black text-sm ${simulationResult.isSaving ? 'text-emerald-700' : 'text-rose-700'}`}>
                {simulationResult.isSaving ? `Total Savings: ${currency}${simulationResult.difference.toLocaleString()}` : `Additional Cost: +${currency}${simulationResult.difference.toLocaleString()}`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium">Original Plan</span>
                <p className="text-lg font-bold text-slate-900">{currency}{simulationResult.originalBudget.toLocaleString()}</p>
                <p className="text-[11px] text-slate-500">{trip.hotelPreference} Lodging · {trip.travelers} Persons</p>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-teal-200 space-y-1">
                <span className="text-teal-600 font-medium">Simulated Plan</span>
                <p className="text-lg font-bold text-teal-700">{currency}{simulationResult.newEstimatedBudget.toLocaleString()}</p>
                <p className="text-[11px] text-slate-500">{targetHotel} Lodging · {targetTravelers} Persons</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-800">Trade-Offs & AI Analysis:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {simulationResult.impactNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() =>
                  onApplyWhatIfScenario(
                    simulationResult.newEstimatedBudget,
                    simulationResult.revisedBreakdown
                  )
                }
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors"
              >
                Apply This Plan ({currency}{simulationResult.newEstimatedBudget.toLocaleString()})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
