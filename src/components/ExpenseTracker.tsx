import React, { useState } from 'react';
import { TripPlan, ExpenseItem } from '../types/travel';
import { DollarSign, Receipt, Plus, Trash2, Tag, Calendar, AlertCircle, ArrowUpRight } from 'lucide-react';

interface ExpenseTrackerProps {
  trip: TripPlan;
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onDeleteExpense: (expenseId: string) => void;
}

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  trip,
  onAddExpense,
  onDeleteExpense,
}) => {
  const { budget, currency, expenses } = trip;

  // Real mathematical calculations
  const totalSpent = (expenses || []).reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const remainingBudget = budget - totalSpent;
  const spentPercent = Math.min(100, Math.round((totalSpent / budget) * 100));

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExpenseItem['category']>('Food');
  const [amount, setAmount] = useState<number | ''>(850);
  const [date, setDate] = useState('2026-10-16');
  const [notes, setNotes] = useState('');

  // Category-wise totals
  const categoriesList: ExpenseItem['category'][] = [
    'Hotel',
    'Food',
    'Transport',
    'Shopping',
    'Activities',
    'Tickets',
    'Guide',
    'Other',
  ];

  const categoryTotals = categoriesList.reduce((acc, cat) => {
    acc[cat] = (expenses || [])
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    return acc;
  }, {} as Record<ExpenseItem['category'], number>);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    onAddExpense({
      name: name.trim(),
      category,
      amount: Number(amount),
      date,
      notes: notes.trim(),
      dayNumber: trip.currentTripDay,
    });

    setName('');
    setAmount('');
    setNotes('');
  };

  // Quick demonstration button helper
  const handleQuickAdd1500 = () => {
    onAddExpense({
      name: 'Water Sports / Parasailing at Candolim',
      category: 'Activities',
      amount: 1500,
      date: '2026-10-16',
      notes: 'Demo test expense (+₹1,500)',
      dayNumber: 2,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Live Expense Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time mathematical sync. When expenses are logged, remaining budget updates across the whole app.
          </p>
        </div>

        <button
          onClick={handleQuickAdd1500}
          className="text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3.5 py-2 rounded-xl transition-colors shrink-0"
        >
          ⚡ Quick Demo: Add ₹1,500 Expense
        </button>
      </div>

      {/* Progress & Summary Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-500 font-medium">Trip Budget Overview</span>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-slate-900">
                {currency}{totalSpent.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">
                spent of {currency}{budget.toLocaleString()} total
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium block">Remaining Balance</span>
            <span className={`text-xl font-black ${remainingBudget < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {currency}{remainingBudget.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Real Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                spentPercent > 90 ? 'bg-rose-500' : spentPercent > 70 ? 'bg-amber-500' : 'bg-teal-600'
              }`}
              style={{ width: `${spentPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>0%</span>
            <span>{spentPercent}% of budget consumed</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Category Totals Matrix */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900">
          Spending by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {categoriesList.map((cat) => {
            const spent = categoryTotals[cat] || 0;
            return (
              <div
                key={cat}
                className="bg-white border border-slate-200 rounded-xl p-3 space-y-1 shadow-2xs"
              >
                <span className="text-[11px] text-slate-500 font-medium block truncate">
                  {cat}
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {currency}{spent.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Add Form + Expense Log Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manual Add Expense Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs h-fit">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-teal-600" />
            Log New Expense
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Expense Name / Item <span className="text-teal-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Lunch at Fisherman's Wharf"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  {categoriesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Amount ({currency}) <span className="text-teal-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  step={10}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="850"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:bg-white focus:outline-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Paid in cash, includes service tip"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors shadow-2xs mt-2"
            >
              Add Expense
            </button>
          </form>
        </div>

        {/* Expenses List Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-base font-bold text-slate-900">
              Recorded Expense Log ({expenses.length})
            </h2>
            <span className="text-xs text-slate-500">
              Total: {currency}{totalSpent.toLocaleString()}
            </span>
          </div>

          {expenses.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No expenses logged yet. Add your first spending item on the left.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="py-3 flex items-center justify-between gap-4 text-xs group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{expense.name}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-medium text-teal-700">{expense.category}</span>
                      {expense.dayNumber && (
                        <>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">Day {expense.dayNumber}</span>
                        </>
                      )}
                    </div>
                    {expense.notes && (
                      <p className="text-slate-500 text-[11px]">{expense.notes}</p>
                    )}
                    <span className="text-[10px] text-slate-400">{expense.date}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {currency}{expense.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      title="Delete expense"
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
