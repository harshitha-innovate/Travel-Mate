import React from 'react';
import { TripPlan } from '../types/travel';
import { MapPin, Calendar, Users, DollarSign, BedDouble, CheckCircle2, Clock, ArrowRight, Bookmark, Utensils, Hotel, Sparkles, Navigation, AlertCircle } from 'lucide-react';

interface TravelDashboardProps {
  trip: TripPlan;
  onNavigateTab: (tab: string) => void;
  onOpenChat: () => void;
}

export const TravelDashboard: React.FC<TravelDashboardProps> = ({
  trip,
  onNavigateTab,
  onOpenChat,
}) => {
  const totalSpent = (trip.expenses || []).reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const remainingBudget = trip.budget - totalSpent;
  const spentPercent = Math.min(100, Math.round((totalSpent / trip.budget) * 100));

  const currentDayPlan = trip.itinerary.find((d) => d.dayNumber === trip.currentTripDay) || trip.itinerary[0];

  const selectedHotel = trip.hotels.find((h) => h.isSelected) || trip.hotels[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-teal-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-300">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>ACTIVE TRIP DASHBOARD · DAY {trip.currentTripDay} OF {trip.durationDays}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {trip.destination}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-2">
              <span>Origin: {trip.startingLocation}</span>
              <span>·</span>
              <span>{trip.departureDate} to {trip.returnDate}</span>
              <span>·</span>
              <span>{trip.travelers} Travelers ({trip.tripStyle} style)</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('itinerary')}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              Full Day-by-Day Itinerary
            </button>
            <button
              onClick={onOpenChat}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm backdrop-blur-xs transition-colors"
            >
              Ask TravelMate AI
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-xs text-slate-400">Total Budget</span>
            <p className="text-xl font-bold text-white">
              {trip.currency}{trip.budget.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Total Spent</span>
            <p className="text-xl font-bold text-amber-400">
              {trip.currency}{totalSpent.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Remaining</span>
            <p className="text-xl font-bold text-emerald-400">
              {trip.currency}{remainingBudget.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Selected Hotel</span>
            <p className="text-sm font-semibold text-slate-200 truncate" title={selectedHotel?.name}>
              {selectedHotel?.name || '4-Star Lodging'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Agenda (Col 1 & 2) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                Today's Schedule ({currentDayPlan?.theme || `Day ${trip.currentTripDay}`})
              </h2>
              <p className="text-xs text-slate-500">
                Geographically sequenced to minimize commuting.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('tracker')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>Trip Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {currentDayPlan?.activities.map((activity, index) => {
              const isCompleted = activity.status === 'completed';
              const isSkipped = activity.status === 'skipped';
              return (
                <div
                  key={activity.id || index}
                  className={`p-3.5 rounded-xl border transition-colors flex items-start justify-between gap-4 ${
                    isCompleted
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : isSkipped
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200/80 hover:border-teal-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {activity.time}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-medium text-teal-700 capitalize">
                        {activity.activityType}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">
                        {activity.duration}
                      </span>
                    </div>
                    <p className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-600' : 'text-slate-900'}`}>
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {activity.location}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900">
                      {trip.currency}{activity.estimatedCost.toLocaleString()}
                    </span>
                    <div className="pt-1">
                      {isCompleted ? (
                        <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      ) : isSkipped ? (
                        <span className="text-[11px] text-slate-400">Skipped</span>
                      ) : (
                        <span className="text-[11px] font-medium text-teal-600">Pending</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget & Saved Summary (Col 3) */}
        <div className="space-y-6">
          {/* Budget Widget */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-teal-600" />
                Budget Tracker
              </h3>
              <button
                onClick={() => onNavigateTab('budget')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900"
              >
                Simulator & AI
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Spent: {trip.currency}{totalSpent.toLocaleString()}</span>
                <span>{spentPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    spentPercent > 90 ? 'bg-rose-500' : spentPercent > 70 ? 'bg-amber-500' : 'bg-teal-500'
                  }`}
                  style={{ width: `${spentPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Remaining: {trip.currency}{remainingBudget.toLocaleString()}</span>
                <span>Budget: {trip.currency}{trip.budget.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-500">Per Person</span>
                <p className="font-bold text-slate-900">
                  {trip.currency}{Math.round(trip.budget / trip.travelers).toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-500">Per Day</span>
                <p className="font-bold text-slate-900">
                  {trip.currency}{Math.round(trip.budget / trip.durationDays).toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('expenses')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              Log New Expense (+{trip.currency})
            </button>
          </div>

          {/* Saved Places & Dining */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-teal-600" />
              Saved Explorations
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Hotel className="w-3.5 h-3.5 text-teal-600" /> Selected Hotel:
                </span>
                <span className="font-semibold text-slate-900 truncate max-w-[140px]">
                  {selectedHotel?.name}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-teal-600" /> Top Restaurants:
                </span>
                <span className="font-semibold text-slate-900">
                  {trip.restaurants.length} Curated
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-teal-600" /> Tourist Attractions:
                </span>
                <span className="font-semibold text-slate-900">
                  {trip.places.length} Places Planned
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('explore')}
              className="w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-lg transition-colors border border-teal-200"
            >
              Browse All Places, Food & Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
