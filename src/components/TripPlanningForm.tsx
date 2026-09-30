import React, { useState } from 'react';
import { TripFormData, HotelRatingTier, FoodPreferenceTier, TransportationMode, TripStyle } from '../types/travel';
import { Compass, Calendar, Users, DollarSign, Sparkles, MapPin, Loader2, ArrowRight, Check } from 'lucide-react';

interface TripPlanningFormProps {
  initialData?: Partial<TripFormData>;
  onSubmit: (formData: TripFormData) => Promise<void>;
  isLoading: boolean;
}

export const TripPlanningForm: React.FC<TripPlanningFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [destination, setDestination] = useState(initialData?.destination || 'Goa');
  const [startingLocation, setStartingLocation] = useState(initialData?.startingLocation || 'Visakhapatnam');
  const [departureDate, setDepartureDate] = useState(initialData?.departureDate || '2026-10-15');
  const [returnDate, setReturnDate] = useState(initialData?.returnDate || '2026-10-19');
  const [adults, setAdults] = useState(initialData?.adults || 3);
  const [children, setChildren] = useState(initialData?.children || 0);
  const [totalBudget, setTotalBudget] = useState(initialData?.totalBudget || 35000);
  const [currency, setCurrency] = useState(initialData?.currency || '₹');
  const [hotelPreference, setHotelPreference] = useState<HotelRatingTier>(initialData?.hotelPreference || '4-star');
  const [foodPreference, setFoodPreference] = useState<FoodPreferenceTier>(initialData?.foodPreference || 'no-preference');
  const [transportation, setTransportation] = useState<TransportationMode>(initialData?.transportation || 'flight');
  const [tripStyle, setTripStyle] = useState<TripStyle>(initialData?.tripStyle || 'friends');
  const [specialRequirements, setSpecialRequirements] = useState(initialData?.specialRequirements || 'Near scenic coastlines, seafood tasting, budget-conscious 4-star experience.');

  const availableInterests = [
    'Beaches',
    'Nature',
    'Adventure',
    'History',
    'Temples',
    'Museums',
    'Shopping',
    'Food',
    'Nightlife',
    'Photography',
    'Family Activities',
    'Wildlife',
    'Spiritual Places',
  ];

  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialData?.interests || ['Beaches', 'Food', 'Shopping', 'History']
  );

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleApplyPreset = (preset: {
    destination: string;
    startingLocation: string;
    departureDate: string;
    returnDate: string;
    adults: number;
    children: number;
    budget: number;
    hotel: HotelRatingTier;
    food: FoodPreferenceTier;
    transport: TransportationMode;
    interests: string[];
    style: TripStyle;
    notes: string;
  }) => {
    setDestination(preset.destination);
    setStartingLocation(preset.startingLocation);
    setDepartureDate(preset.departureDate);
    setReturnDate(preset.returnDate);
    setAdults(preset.adults);
    setChildren(preset.children);
    setTotalBudget(preset.budget);
    setHotelPreference(preset.hotel);
    setFoodPreference(preset.food);
    setTransportation(preset.transport);
    setSelectedInterests(preset.interests);
    setTripStyle(preset.style);
    setSpecialRequirements(preset.notes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData: TripFormData = {
      destination: destination.trim(),
      startingLocation: startingLocation.trim(),
      departureDate,
      returnDate,
      travelers: adults + children,
      adults,
      children,
      totalBudget: Number(totalBudget),
      currency,
      hotelPreference,
      foodPreference,
      transportation,
      interests: selectedInterests,
      tripStyle,
      specialRequirements,
    };
    await onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Your AI-Crafted Travel Plan
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Provide your destinations, budget constraints, and personal interests. TravelMate AI will generate an optimized, geographically clustered itinerary.
        </p>
      </div>

      {/* Quick Presets for Evaluator */}
      <div className="bg-teal-50/70 border border-teal-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-teal-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-teal-600" /> Quick Demonstration Presets:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              handleApplyPreset({
                destination: 'Goa',
                startingLocation: 'Visakhapatnam',
                departureDate: '2026-10-15',
                returnDate: '2026-10-19',
                adults: 3,
                children: 0,
                budget: 35000,
                hotel: '4-star',
                food: 'no-preference',
                transport: 'flight',
                interests: ['Beaches', 'Food', 'Shopping', 'History'],
                style: 'friends',
                notes: 'Near scenic coastlines, seafood tasting, budget conscious 4-star experience.',
              })
            }
            className="px-2.5 py-1 bg-white hover:bg-teal-100 text-teal-800 rounded-md font-medium border border-teal-200 transition-colors shadow-2xs"
          >
            Goa (Visakhapatnam, ₹35,000, 3 Friends)
          </button>
          <button
            type="button"
            onClick={() =>
              handleApplyPreset({
                destination: 'Manali & Solang',
                startingLocation: 'Delhi',
                departureDate: '2026-11-01',
                returnDate: '2026-11-06',
                adults: 2,
                children: 0,
                budget: 28000,
                hotel: '3-star',
                food: 'vegetarian',
                transport: 'bus',
                interests: ['Nature', 'Adventure', 'Photography'],
                style: 'couple',
                notes: 'Mountain valley views, scenic cafe stops, snow point adventure.',
              })
            }
            className="px-2.5 py-1 bg-white hover:bg-teal-100 text-teal-800 rounded-md font-medium border border-teal-200 transition-colors shadow-2xs"
          >
            Manali (Delhi, ₹28,000, Couple)
          </button>
          <button
            type="button"
            onClick={() =>
              handleApplyPreset({
                destination: 'Jaipur & Udaipur',
                startingLocation: 'Mumbai',
                departureDate: '2026-12-10',
                returnDate: '2026-12-15',
                adults: 4,
                children: 1,
                budget: 45000,
                hotel: '4-star',
                food: 'vegetarian',
                transport: 'train',
                interests: ['History', 'Museums', 'Shopping', 'Photography'],
                style: 'family',
                notes: 'Heritage forts, royal palaces, Rajasthani craft markets, peaceful lake dinners.',
              })
            }
            className="px-2.5 py-1 bg-white hover:bg-teal-100 text-teal-800 rounded-md font-medium border border-teal-200 transition-colors shadow-2xs"
          >
            Jaipur (Heritage Family)
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs">
        {/* Section 1: Route & Dates */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Destination & Travel Dates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Destination <span className="text-teal-600">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Goa, Paris, Manali, Tokyo"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Starting Location (Origin) <span className="text-teal-600">*</span>
              </label>
              <input
                type="text"
                required
                value={startingLocation}
                onChange={(e) => setStartingLocation(e.target.value)}
                placeholder="e.g. Visakhapatnam, Hyderabad, Delhi"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Departure Date <span className="text-teal-600">*</span>
              </label>
              <input
                type="date"
                required
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Return Date <span className="text-teal-600">*</span>
              </label>
              <input
                type="date"
                required
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Group & Budget */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            2. Travelers & Total Budget
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adults
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={adults}
                onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Children
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={children}
                onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-teal-500 focus:border-teal-500"
              >
                <option value="₹">₹ (INR)</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
                <option value="AED">AED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Budget
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">{currency}</span>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-semibold focus:bg-white focus:outline-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Stay & Travel Preferences */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            3. Hotel, Dining & Transportation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hotel Preference
              </label>
              <select
                value={hotelPreference}
                onChange={(e) => setHotelPreference(e.target.value as HotelRatingTier)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-teal-500 focus:border-teal-500"
              >
                <option value="budget">Budget Lodging / Hostel</option>
                <option value="3-star">3 Star Hotel</option>
                <option value="4-star">4 Star Hotel</option>
                <option value="5-star">5 Star Luxury Resort</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Food Preference
              </label>
              <select
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value as FoodPreferenceTier)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-teal-500 focus:border-teal-500"
              >
                <option value="no-preference">No Preference (All Cuisines)</option>
                <option value="vegetarian">Pure Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian / Seafood</option>
                <option value="vegan">Strict Vegan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transportation Mode
              </label>
              <select
                value={transportation}
                onChange={(e) => setTransportation(e.target.value as TransportationMode)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-teal-500 focus:border-teal-500"
              >
                <option value="flight">Flight</option>
                <option value="train">Train</option>
                <option value="bus">Bus / Coach</option>
                <option value="rental-car">Rental Car / Self-Drive</option>
                <option value="taxi">Taxi / Private Cab</option>
                <option value="public-transport">Public Metro & Bus</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Trip Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {(['budget', 'balanced', 'luxury', 'family', 'couple', 'friends', 'solo'] as TripStyle[]).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setTripStyle(style)}
                  className={`py-1.5 px-3 text-xs font-medium rounded-lg capitalize border transition-all text-center ${
                    tripStyle === style
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Travel Interests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-base font-bold text-slate-900">
              4. Travel Interests ({selectedInterests.length} selected)
            </h2>
            <span className="text-xs text-slate-500">Pick any combination</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {availableInterests.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors text-left ${
                    isSelected
                      ? 'bg-teal-50 border-teal-400 text-teal-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{interest}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: Special Requirements */}
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            5. Special Requirements & Notes
          </h2>
          <textarea
            rows={3}
            value={specialRequirements}
            onChange={(e) => setSpecialRequirements(e.target.value)}
            placeholder="e.g. Need wheelchair accessible spots, prefer sea-view rooms, allergic to peanuts, want scenic sunset photography locations..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-teal-500 focus:border-teal-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Reasoner Synthesizing Itinerary...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate My Trip</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
