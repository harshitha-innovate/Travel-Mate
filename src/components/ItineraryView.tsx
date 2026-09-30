import React, { useState } from 'react';
import { TripPlan, ActivityItem, DayPlan } from '../types/travel';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle2, XCircle, RotateCcw, Plus, Sparkles, Navigation, AlertTriangle, ArrowRight, RefreshCw, Car, Footprints } from 'lucide-react';

interface ItineraryViewProps {
  trip: TripPlan;
  onUpdateActivityStatus: (dayNumber: number, activityId: string, status: 'pending' | 'completed' | 'skipped') => void;
  onReplaceActivity: (dayNumber: number, oldActivityId: string, newTitle: string, newCost: number, newNotes: string) => void;
  onAddActivity: (dayNumber: number, activity: ActivityItem) => void;
  onReplanTrip: () => void;
  onRequestAlternativeForActivity: (placeName: string) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  onUpdateActivityStatus,
  onReplaceActivity,
  onAddActivity,
  onReplanTrip,
  onRequestAlternativeForActivity,
}) => {
  const [selectedDay, setSelectedDay] = useState(trip.currentTripDay || 1);
  const [showAddModal, setShowAddModal] = useState(false);

  // New activity form states
  const [newTitle, setNewTitle] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('Afternoon');
  const [newTime, setNewTime] = useState('02:30 PM');
  const [newLocation, setNewLocation] = useState('');
  const [newCost, setNewCost] = useState(250);
  const [newDuration, setNewDuration] = useState('1.5 hours');
  const [newTransport, setNewTransport] = useState('Cab');
  const [newNotes, setNewNotes] = useState('');

  const currentDayData = trip.itinerary.find((d) => d.dayNumber === selectedDay) || trip.itinerary[0];

  const handleAddNewActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newActivity: ActivityItem = {
      id: `act-manual-${Date.now()}`,
      timeSlot: newTimeSlot,
      time: newTime,
      title: newTitle.trim(),
      activityType: 'attraction',
      location: newLocation.trim() || trip.destination,
      duration: newDuration,
      estimatedCost: Number(newCost) || 0,
      travelTimeFromPrevious: '15 min drive',
      transportationMode: newTransport,
      notes: newNotes || 'Manually added to itinerary',
      status: 'pending',
    };

    onAddActivity(selectedDay, newActivity);
    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Day Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Day-by-Day Travel Itinerary
            </h1>
            <span className="text-xs bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded-md border border-teal-200">
              Geographically Clustered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Minimizes backtracking across {trip.destination}. Distances and estimated entry fees clearly noted.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Activity</span>
          </button>

          <button
            onClick={onReplanTrip}
            className="inline-flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replan Trip</span>
          </button>
        </div>
      </div>

      {/* Days Tabs (Segmented Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 no-scrollbar">
        {trip.itinerary.map((day) => {
          const isSelected = selectedDay === day.dayNumber;
          const isToday = day.dayNumber === trip.currentTripDay;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDay(day.dayNumber)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Day {day.dayNumber}</span>
              {isToday && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-teal-800 text-teal-100' : 'bg-teal-100 text-teal-800'}`}>
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Current Day Theme Banner */}
      {currentDayData && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs text-teal-400 font-bold uppercase tracking-wider">
              {currentDayData.dateStr}
            </span>
            <h2 className="text-lg font-bold text-white">
              {currentDayData.theme}
            </h2>
          </div>
          <div className="text-xs text-slate-300">
            {currentDayData.activities.length} Scheduled Stops · Geographically Optimized
          </div>
        </div>
      )}

      {/* Activities Timeline */}
      <div className="space-y-4">
        {currentDayData?.activities.map((activity, idx) => {
          const isCompleted = activity.status === 'completed';
          const isSkipped = activity.status === 'skipped';

          return (
            <div
              key={activity.id || idx}
              className={`bg-white border rounded-2xl p-5 transition-all shadow-2xs ${
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : isSkipped
                  ? 'border-slate-200 bg-slate-50/60 opacity-60'
                  : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Left Side Info */}
                <div className="space-y-2 flex-1">
                  {/* Clean unboxed text metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" /> {activity.time}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-teal-700 capitalize">{activity.timeSlot}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{activity.activityType}</span>
                    <span aria-hidden="true">·</span>
                    <span>Duration: {activity.duration}</span>
                  </div>

                  <h3 className={`text-base font-bold text-slate-900 ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                    {activity.title}
                  </h3>

                  {activity.isAlternative && (
                    <div className="text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 inline-block font-medium">
                      ✓ Replaced original attraction ({activity.originalActivityTitle || 'missed place'})
                    </div>
                  )}

                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{activity.location}</span>
                  </p>

                  {/* Travel & Commute details */}
                  <div className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Car className="w-3.5 h-3.5 text-teal-600" /> Transit: {activity.transportationMode}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Commute: {activity.travelTimeFromPrevious}</span>
                  </div>

                  {activity.notes && (
                    <p className="text-xs text-slate-500 italic bg-amber-50/60 border border-amber-100 rounded-md p-2">
                      💡 Note: {activity.notes}
                    </p>
                  )}
                </div>

                {/* Right Side Cost & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Est. Cost</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {trip.currency}{activity.estimatedCost.toLocaleString()}
                    </span>
                  </div>

                  {/* Interactive Status & Alternative Triggers */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        onUpdateActivityStatus(
                          selectedDay,
                          activity.id,
                          isCompleted ? 'pending' : 'completed'
                        )
                      }
                      title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                      className={`p-1.5 rounded-lg border text-xs font-medium transition-colors ${
                        isCompleted
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() =>
                        onUpdateActivityStatus(
                          selectedDay,
                          activity.id,
                          isSkipped ? 'pending' : 'skipped'
                        )
                      }
                      title={isSkipped ? 'Unskip' : 'Skip Activity'}
                      className={`p-1.5 rounded-lg border text-xs font-medium transition-colors ${
                        isSkipped
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>

                    {/* Find Alternative Button */}
                    <button
                      onClick={() => onRequestAlternativeForActivity(activity.title)}
                      title="Missed or closed? Find nearby alternative with AI"
                      className="p-1.5 rounded-lg border border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors text-xs font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Alternative</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Add Activity to Day {selectedDay}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewActivitySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Activity Title <span className="text-teal-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Reis Magos Fort or Sunset Kayaking"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Evening">Evening</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Night">Night</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 03:00 PM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. North Goa Coast"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estimated Cost ({trip.currency})
                  </label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Transport Mode
                  </label>
                  <input
                    type="text"
                    value={newTransport}
                    onChange={(e) => setNewTransport(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Practical Notes / Tips
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Modest clothing required, buy tickets online to skip queue"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 shadow-2xs"
                >
                  Insert Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
