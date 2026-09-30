import React, { useState } from 'react';
import { TripPlan, ActivityItem, AlternativePlaceSuggestion } from '../types/travel';
import { Clock, MapPin, CheckCircle2, XCircle, Sparkles, Navigation, AlertTriangle, ArrowRight, Check, Compass, Calendar } from 'lucide-react';
import { suggestAlternativesAI } from '../services/api';

interface TripTrackerProps {
  trip: TripPlan;
  onUpdateActivityStatus: (dayNumber: number, activityId: string, status: 'pending' | 'completed' | 'skipped') => void;
  onReplaceActivity: (dayNumber: number, oldActivityId: string, newTitle: string, newCost: number, newNotes: string) => void;
}

export const TripTracker: React.FC<TripTrackerProps> = ({
  trip,
  onUpdateActivityStatus,
  onReplaceActivity,
}) => {
  const currentDayPlan = trip.itinerary.find((d) => d.dayNumber === trip.currentTripDay) || trip.itinerary[0];

  // Alternative suggestions modal state
  const [activeMissedActivity, setActiveMissedActivity] = useState<ActivityItem | null>(null);
  const [alternativesList, setAlternativesList] = useState<AlternativePlaceSuggestion[]>(trip.alternativeSuggestions || []);
  const [isLoadingAlternatives, setIsLoadingAlternatives] = useState(false);

  const handleOpenAlternativeFor = async (activity: ActivityItem) => {
    setActiveMissedActivity(activity);
    setIsLoadingAlternatives(true);
    try {
      const res = await suggestAlternativesAI(trip, activity.title, 'Missed scheduled time window', '2 hours');
      if (res && res.alternatives && res.alternatives.length > 0) {
        setAlternativesList(res.alternatives);
      }
    } catch (e) {
      console.error('Failed to load dynamic alternatives:', e);
    } finally {
      setIsLoadingAlternatives(false);
    }
  };

  const handleApplyAlternative = (alt: AlternativePlaceSuggestion) => {
    if (!activeMissedActivity) return;
    onReplaceActivity(
      trip.currentTripDay,
      activeMissedActivity.id,
      alt.alternativeName,
      alt.estimatedCost,
      `Alternative to ${alt.originalPlaceName}: ${alt.whyRecommended}`
    );
    setActiveMissedActivity(null);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Active Trip Live Tracker Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-teal-800/40 relative overflow-hidden">
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE IN PROGRESS · DAY {trip.currentTripDay} OF {trip.durationDays}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Live Trip Companion
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {trip.destination} · {currentDayPlan?.theme || 'Active Exploration'}
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-xs text-xs space-y-1 text-right">
            <span className="text-slate-400">Schedule Status</span>
            <p className="text-lg font-bold text-teal-300">
              {currentDayPlan?.activities.filter((a) => a.status === 'completed').length} of {currentDayPlan?.activities.length} Stops Visited
            </p>
            <span className="text-[11px] text-slate-400">
              Auto-suggests nearby alternatives if any stop is missed.
            </span>
          </div>
        </div>
      </div>

      {/* Today's Live Step-by-Step Agenda */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              Today's Step-by-Step Itinerary
            </h2>
            <p className="text-xs text-slate-500">
              Mark items complete as you travel or request instant backup routes.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {currentDayPlan?.activities.map((activity, idx) => {
            const isCompleted = activity.status === 'completed';
            const isSkipped = activity.status === 'skipped';

            return (
              <div
                key={activity.id || idx}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : isSkipped
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-white border-slate-200 hover:border-teal-300 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-extrabold text-slate-900">{activity.time}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-teal-700 capitalize">{activity.timeSlot}</span>
                      <span aria-hidden="true">·</span>
                      <span>Duration: {activity.duration}</span>
                      <span aria-hidden="true">·</span>
                      <span>Transit: {activity.transportationMode}</span>
                    </div>

                    <h3 className={`text-base font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {activity.title}
                    </h3>

                    {activity.isAlternative && (
                      <span className="inline-block text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                        ✓ Replaced with nearby backup attraction
                      </span>
                    )}

                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{activity.location}</span>
                    </p>

                    {activity.notes && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {activity.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions & Status */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5 shrink-0 pt-2 sm:pt-0">
                    <span className="text-xs font-bold text-slate-900">
                      Est. {trip.currency}{activity.estimatedCost.toLocaleString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onUpdateActivityStatus(
                            trip.currentTripDay,
                            activity.id,
                            isCompleted ? 'pending' : 'completed'
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                          isCompleted
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'Visited' : 'Complete'}</span>
                      </button>

                      <button
                        onClick={() => {
                          onUpdateActivityStatus(
                            trip.currentTripDay,
                            activity.id,
                            isSkipped ? 'pending' : 'skipped'
                          );
                          if (!isSkipped) {
                            handleOpenAlternativeFor(activity);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                          isSkipped
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{isSkipped ? 'Skipped' : 'Missed'}</span>
                      </button>
                    </div>

                    {/* Proactive Alternative Trigger */}
                    <button
                      onClick={() => handleOpenAlternativeFor(activity)}
                      className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 pt-1"
                    >
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      <span>Suggest Backup Place</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Missed Place & Alternatives Drawer / Modal (Section 18 & 19) */}
      {activeMissedActivity && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  MISSED OR CLOSED PLACE ROUTING
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Original: {activeMissedActivity.title}
                </h3>
                <p className="text-xs text-slate-500">
                  AI analyzed remaining time, distance from current location, and user interests to suggest viable nearby alternatives.
                </p>
              </div>
              <button
                onClick={() => setActiveMissedActivity(null)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Alternatives List */}
            <div className="space-y-3.5">
              <span className="text-xs font-bold text-slate-800">
                Recommended Alternative Replacements:
              </span>

              {alternativesList.map((alt) => (
                <div
                  key={alt.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-teal-700">{alt.category}</span>
                      <h4 className="text-sm font-bold text-slate-900">{alt.alternativeName}</h4>
                    </div>
                    <span className="text-xs font-bold text-slate-900 shrink-0">
                      {alt.estimatedCost === 0 ? 'Free' : `Est. ${trip.currency}${alt.estimatedCost}`}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span>Distance: {alt.distance}</span>
                    <span aria-hidden="true">·</span>
                    <span>Duration: {alt.duration}</span>
                    <span aria-hidden="true">·</span>
                    <span>Hours: {alt.openHours}</span>
                  </div>

                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                    <strong>Reason for Recommendation:</strong> {alt.whyRecommended}
                  </p>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleApplyAlternative(alt)}
                      className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Replace in Itinerary</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveMissedActivity(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200"
              >
                Close Without Changing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
