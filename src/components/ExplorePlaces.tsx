import React, { useState } from 'react';
import { TripPlan, TouristPlace, HotelRecommendation, RestaurantRecommendation, ShoppingSpot, TouristGuide } from '../types/travel';
import { MapPin, Star, Clock, DollarSign, Check, Plus, ShieldCheck, Utensils, ShoppingBag, UserCheck, Search, Filter, Info, AlertCircle, ExternalLink } from 'lucide-react';

interface ExplorePlacesProps {
  trip: TripPlan;
  onSelectHotel: (hotelId: string) => void;
  onAddPlaceToItinerary: (place: TouristPlace) => void;
  onAddRestaurantToTrip: (restaurant: RestaurantRecommendation) => void;
  onAddShoppingToTrip: (spot: ShoppingSpot) => void;
}

export const ExplorePlaces: React.FC<ExplorePlacesProps> = ({
  trip,
  onSelectHotel,
  onAddPlaceToItinerary,
  onAddRestaurantToTrip,
  onAddShoppingToTrip,
}) => {
  const [activeCategory, setActiveCategory] = useState<'places' | 'hotels' | 'food' | 'shopping' | 'guides'>('places');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Hotel filters
  const [hotelStarFilter, setHotelStarFilter] = useState<number | 'all'>('all');
  const [maxPricePerNight, setMaxPricePerNight] = useState<number>(10000);

  // Selected Place Details Modal
  const [detailedPlace, setDetailedPlace] = useState<TouristPlace | null>(null);

  // Compare Hotels Modal
  const [isComparingHotels, setIsComparingHotels] = useState(false);

  // Filtered places
  const filteredPlaces = trip.places.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered hotels
  const filteredHotels = trip.hotels.filter((h) => {
    const matchesStar = hotelStarFilter === 'all' || h.starRating === hotelStarFilter;
    const matchesPrice = h.pricePerNight <= maxPricePerNight;
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStar && matchesPrice && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header and Category Switcher */}
      <div className="space-y-4 border-b border-slate-200 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Explore {trip.destination}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Curated tourist attractions, verified hotels, authentic regional cuisine, local bazaars, and accredited guides.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, cuisine, area..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-teal-500"
            />
          </div>
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'places', label: 'Tourist Places', count: trip.places.length },
            { id: 'hotels', label: 'Hotel Finder', count: trip.hotels.length },
            { id: 'food', label: 'Food & Dining', count: trip.restaurants.length },
            { id: 'shopping', label: 'Shopping Guide', count: trip.shopping.length },
            { id: 'guides', label: 'Tourist Guides', count: trip.guides.length },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-teal-800 text-teal-100' : 'bg-slate-100 text-slate-600'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Tourist Places Tab */}
      {activeCategory === 'places' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 hover:border-teal-300 transition-colors shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-teal-700">{place.category}</span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{place.name}</h3>
                    </div>
                    <span className="text-xs font-bold text-slate-900 shrink-0">
                      {place.estimatedEntryFee === 0 ? 'Free Entry' : `Est. ${trip.currency}${place.estimatedEntryFee}`}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>

                  {/* Unboxed Metadata with separators */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-teal-600" /> {place.openTime} - {place.closeTime}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Duration: {place.estimatedDuration}</span>
                    <span aria-hidden="true">·</span>
                    <span>{place.weeklyHoliday || 'Open Daily'}</span>
                  </div>

                  <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{place.location} ({place.distanceFromPrevious})</span>
                    </div>
                    <p className="text-[11px] text-teal-800 font-medium">
                      ✨ Why: {place.whyRecommended}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setDetailedPlace(place)}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onAddPlaceToItinerary(place)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Itinerary</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Hotel Finder Tab */}
      {activeCategory === 'hotels' && (
        <div className="space-y-5">
          {/* Prominent Disclaimer as Required by Prompt */}
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Pricing Transparency Notice:</strong> Estimated price — verify before booking. Live real-time availability and dynamic room pricing require official booking channel verification.
              </span>
            </div>
            <button
              onClick={() => setIsComparingHotels(true)}
              className="bg-amber-900 text-white font-semibold px-3 py-1.5 rounded-lg shrink-0 hover:bg-amber-800 transition-colors text-[11px]"
            >
              Compare Hotels
            </button>
          </div>

          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Filter Star Rating:</span>
              <div className="flex items-center gap-1">
                {(['all', 3, 4, 5] as const).map((star) => (
                  <button
                    key={star}
                    onClick={() => setHotelStarFilter(star)}
                    className={`px-2.5 py-1 rounded-md font-medium border ${
                      hotelStarFilter === star
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {star === 'all' ? 'All Tiers' : `${star} Star`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Max Nightly Rate:</span>
              <span className="font-bold text-slate-900">{trip.currency}{maxPricePerNight.toLocaleString()}</span>
              <input
                type="range"
                min={2000}
                max={15000}
                step={500}
                value={maxPricePerNight}
                onChange={(e) => setMaxPricePerNight(Number(e.target.value))}
                className="accent-teal-600 w-28"
              />
            </div>
          </div>

          {/* Hotel Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className={`bg-white border rounded-2xl p-5 space-y-4 transition-all shadow-2xs flex flex-col justify-between ${
                  hotel.isSelected ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200 hover:border-teal-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        {Array.from({ length: hotel.starRating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                        <span className="text-slate-600 ml-1">· {hotel.starRating} Star</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{hotel.name}</h3>
                    </div>
                    {hotel.isSelected && (
                      <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md shrink-0">
                        Selected Hotel
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{hotel.location}</span>
                  </p>

                  <div className="bg-slate-50 p-2.5 rounded-xl space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Price / Night:</span>
                      <span className="font-bold text-slate-900">{trip.currency}{hotel.pricePerNight.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Stay ({hotel.numberOfNights} nights):</span>
                      <span className="font-bold text-teal-700">{trip.currency}{hotel.estimatedTotalStayCost.toLocaleString()}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      Proximity: {hotel.distanceFromAttractions}
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600">Key Amenities:</span>
                    <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                      {hotel.facilities.map((fac, idx) => (
                        <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded-md">
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-teal-800 bg-teal-50/70 p-2 rounded-lg font-medium">
                    💡 {hotel.whyRecommended}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onSelectHotel(hotel.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                      hotel.isSelected
                        ? 'bg-teal-600 text-white cursor-default'
                        : 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                    }`}
                  >
                    {hotel.isSelected ? '✓ Current Selection' : 'Select Hotel'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Food & Dining Tab */}
      {activeCategory === 'food' && (
        <div className="space-y-6">
          {/* Local Famous Foods highlight */}
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/70 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-teal-950 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-teal-700" />
              Must-Try Authentic Culinary Specialties in {trip.destination}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white/80 p-2.5 rounded-lg border border-teal-100">
                <span className="font-bold text-slate-900 block">Goan Fish Curry Thali</span>
                <span className="text-slate-500 text-[11px]">Tangy coconut & kokum gravy with surmai/kingfish</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-teal-100">
                <span className="font-bold text-slate-900 block">Bebinca & Alle Belle</span>
                <span className="text-slate-500 text-[11px]">Traditional 7-layer coconut milk dessert & jaggery pancakes</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-teal-100">
                <span className="font-bold text-slate-900 block">Mushroom & Veg Xacuti</span>
                <span className="text-slate-500 text-[11px]">Roasted aromatic spice blend with coconut milk</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-teal-100">
                <span className="font-bold text-slate-900 block">Prawn Balchão & Sol Kadi</span>
                <span className="text-slate-500 text-[11px]">Spicy pickled seafood relish and refreshing digestive drink</span>
              </div>
            </div>
          </div>

          {/* Restaurant recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {trip.restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 hover:border-teal-300 transition-colors shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-teal-700">{restaurant.cuisine}</span>
                    <h3 className="text-base font-bold text-slate-900">{restaurant.name}</h3>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{restaurant.location} ({restaurant.distance})</span>
                  </p>

                  <div className="text-xs bg-slate-50 p-2.5 rounded-xl space-y-1 text-slate-600">
                    <div className="flex justify-between font-medium">
                      <span>Price Range:</span>
                      <span className="font-bold text-slate-900">{restaurant.priceRange}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
                      {restaurant.hasVegOptions && <span className="text-emerald-700 font-semibold">✓ Vegetarian</span>}
                      {restaurant.hasNonVegOptions && <span>· Non-Veg</span>}
                      {restaurant.hasVeganOptions && <span>· Vegan Options</span>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-700">Signature Dishes:</span>
                    <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                      {restaurant.localDishes.map((dish, i) => (
                        <li key={i}>{dish}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-[11px] text-teal-800 bg-teal-50/70 p-2 rounded-lg font-medium">
                    💡 {restaurant.whyRecommended}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onAddRestaurantToTrip(restaurant)}
                    className="w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold rounded-xl text-xs border border-teal-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Restaurant to Trip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Shopping Guide Tab */}
      {activeCategory === 'shopping' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {trip.shopping.map((spot) => (
              <div
                key={spot.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 hover:border-teal-300 transition-colors shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-teal-700">{spot.marketType}</span>
                    <h3 className="text-base font-bold text-slate-900">{spot.name}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-teal-600" /> {spot.openingHours}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Price Range: {spot.priceRange}</span>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{spot.location}</span>
                  </p>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-700">What to Buy:</span>
                    <div className="flex flex-wrap gap-1.5 text-xs text-slate-700">
                      {spot.specialties.map((item, i) => (
                        <span key={i} className="bg-slate-100 px-2 py-0.5 rounded-md">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-teal-800 bg-teal-50/70 p-2 rounded-lg font-medium">
                    ✨ {spot.whyRecommended}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onAddShoppingToTrip(spot)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Shopping Stop</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Tourist Guide Finder Tab */}
      {activeCategory === 'guides' && (
        <div className="space-y-5">
          {/* Official Verification Notice as Required */}
          <div className="bg-slate-100 border border-slate-200 text-slate-700 rounded-xl p-4 text-xs flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
            <p>
              <strong>Official Guide Policy:</strong> TravelMate AI does not fabricate personal mobile numbers or unverified contact info. Always book through officially recognized counters (such as the State Tourism Development Corporation / GTDC desk) and verify the guide’s accredited badge upon arrival.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {trip.guides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 hover:border-teal-300 transition-colors shadow-2xs"
              >
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-teal-700">Accredited Guide Service</span>
                  <h3 className="text-base font-bold text-slate-900">{guide.serviceName}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{guide.location}</span>
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Approx Charges:</span>
                    <span className="font-bold text-slate-900">{guide.approxCharges}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Experience:</span>
                    <span className="font-semibold text-slate-800">{guide.experienceYears}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-200/60 text-[11px]">
                    <span className="font-semibold text-slate-600">Languages: </span>
                    <span>{guide.languages.join(', ')}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-700">Areas Covered:</span>
                  <p className="text-slate-600 text-xs">
                    {guide.areasCovered.join(' · ')}
                  </p>
                </div>

                <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200/60 space-y-0.5">
                  <span className="font-bold block">Verification Note:</span>
                  <span>{guide.verificationNote}</span>
                </div>

                <div className="pt-2 text-xs text-slate-500">
                  Booking Source: <strong>{guide.bookingSource}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Place Details Modal */}
      {detailedPlace && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-teal-700">{detailedPlace.category}</span>
                <h3 className="text-lg font-bold text-slate-900">{detailedPlace.name}</h3>
              </div>
              <button
                onClick={() => setDetailedPlace(null)}
                className="p-1 text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {detailedPlace.description}
            </p>

            <div className="bg-slate-50 p-3 rounded-xl space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Timings:</span>
                <span className="font-semibold">{detailedPlace.openTime} - {detailedPlace.closeTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Recommended Duration:</span>
                <span className="font-semibold">{detailedPlace.estimatedDuration}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Entry Fee:</span>
                <span className="font-bold text-slate-900">
                  {detailedPlace.estimatedEntryFee === 0 ? 'Free' : `${trip.currency}${detailedPlace.estimatedEntryFee} / person`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Weekly Off:</span>
                <span className="font-semibold">{detailedPlace.weeklyHoliday || 'Open Daily'}</span>
              </div>
              <div className="flex justify-between">
                <span>Best Visiting Time:</span>
                <span className="font-semibold">{detailedPlace.recommendedTime}</span>
              </div>
            </div>

            <div className="text-xs bg-teal-50 text-teal-900 p-2.5 rounded-lg border border-teal-200">
              <strong>Why Recommended:</strong> {detailedPlace.whyRecommended}
            </div>

            {detailedPlace.notes && (
              <p className="text-xs text-slate-500 italic">
                Note: {detailedPlace.notes}
              </p>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setDetailedPlace(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onAddPlaceToItinerary(detailedPlace);
                  setDetailedPlace(null);
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700"
              >
                Add to Itinerary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Hotels Modal */}
      {isComparingHotels && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Hotel Comparison Matrix ({trip.destination})
              </h3>
              <button
                onClick={() => setIsComparingHotels(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-4 font-semibold">Features</th>
                    {trip.hotels.map((h) => (
                      <th key={h.id} className="py-2 px-3 font-bold text-slate-900">
                        {h.name} {h.isSelected && <span className="text-teal-600 block text-[10px]">Current</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 font-semibold text-slate-500">Star Rating</td>
                    {trip.hotels.map((h) => (
                      <td key={h.id} className="py-2.5 px-3 font-bold">
                        {h.starRating} Stars
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-slate-500">Price / Night</td>
                    {trip.hotels.map((h) => (
                      <td key={h.id} className="py-2.5 px-3 font-bold text-teal-700">
                        {trip.currency}{h.pricePerNight.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-slate-500">Total Stay ({trip.hotels[0].numberOfNights} Nights)</td>
                    {trip.hotels.map((h) => (
                      <td key={h.id} className="py-2.5 px-3 font-bold text-slate-900">
                        {trip.currency}{h.estimatedTotalStayCost.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-slate-500">Location & Proximity</td>
                    {trip.hotels.map((h) => (
                      <td key={h.id} className="py-2.5 px-3 text-[11px]">
                        {h.distanceFromAttractions}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-slate-500">Amenities</td>
                    {trip.hotels.map((h) => (
                      <td key={h.id} className="py-2.5 px-3 text-[11px]">
                        {h.facilities.join(', ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-slate-500">Action</td>
                    {trip.hotels.map((h) => (
                      <td key={h.id} className="py-2.5 px-3">
                        <button
                          onClick={() => {
                            onSelectHotel(h.id);
                            setIsComparingHotels(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                            h.isSelected
                              ? 'bg-teal-600 text-white'
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          {h.isSelected ? 'Selected' : 'Select'}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              * Note: Estimated prices based on seasonal standard rates. Verify real-time availability prior to departure.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
