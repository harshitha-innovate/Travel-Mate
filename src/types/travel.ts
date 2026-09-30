export type HotelRatingTier = 'budget' | '3-star' | '4-star' | '5-star';
export type FoodPreferenceTier = 'vegetarian' | 'non-vegetarian' | 'vegan' | 'no-preference';
export type TransportationMode = 'public-transport' | 'bus' | 'train' | 'flight' | 'rental-car' | 'taxi';
export type TripStyle = 'budget' | 'balanced' | 'luxury' | 'family' | 'couple' | 'friends' | 'solo';

export interface TripFormData {
  destination: string;
  startingLocation: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  adults: number;
  children: number;
  totalBudget: number;
  currency: string;
  hotelPreference: HotelRatingTier;
  foodPreference: FoodPreferenceTier;
  transportation: TransportationMode;
  interests: string[];
  tripStyle: TripStyle;
  specialRequirements: string;
}

export interface TouristPlace {
  id: string;
  name: string;
  category: string;
  description: string;
  estimatedDuration: string;
  openTime: string;
  closeTime: string;
  weeklyHoliday?: string;
  estimatedEntryFee: number;
  location: string;
  distanceFromPrevious: string;
  recommendedTime: string;
  whyRecommended: string;
  isVerified: boolean;
  notes?: string;
}

export interface HotelRecommendation {
  id: string;
  name: string;
  starRating: number;
  userRating?: number;
  pricePerNight: number;
  numberOfNights: number;
  estimatedTotalStayCost: number;
  distanceFromAttractions: string;
  facilities: string[];
  location: string;
  whyRecommended: string;
  isSelected?: boolean;
}

export interface RestaurantRecommendation {
  id: string;
  name: string;
  cuisine: string;
  localDishes: string[];
  hasVegOptions: boolean;
  hasNonVegOptions: boolean;
  hasVeganOptions: boolean;
  priceRange: string; // e.g. "$$", "₹300 - ₹600 per person"
  estimatedCostPerMeal: number;
  location: string;
  distance: string;
  whyRecommended: string;
  isSaved?: boolean;
}

export interface ShoppingSpot {
  id: string;
  name: string;
  marketType: string;
  specialties: string[];
  priceRange: string;
  openingHours: string;
  location: string;
  whyRecommended: string;
  isSaved?: boolean;
}

export interface TouristGuide {
  id: string;
  serviceName: string;
  location: string;
  languages: string[];
  areasCovered: string[];
  approxCharges: string;
  experienceYears: string;
  bookingSource: string;
  verificationNote: string;
}

export interface ActivityItem {
  id: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Lunch' | 'Evening' | 'Dinner' | 'Night' | string;
  time: string;
  title: string;
  activityType: 'attraction' | 'food' | 'transport' | 'leisure' | 'hotel' | 'shopping';
  location: string;
  duration: string;
  estimatedCost: number;
  travelTimeFromPrevious: string;
  transportationMode: string;
  notes: string;
  status: 'pending' | 'completed' | 'skipped';
  isAlternative?: boolean;
  originalActivityTitle?: string;
}

export interface DayPlan {
  dayNumber: number;
  dateStr: string;
  theme: string;
  activities: ActivityItem[];
}

export interface BudgetBreakdown {
  hotel: number;
  transport: number;
  food: number;
  activities: number;
  shopping: number;
  emergencyBuffer: number;
  guide?: number;
  miscellaneous?: number;
  totalEstimated: number;
}

export interface ExpenseItem {
  id: string;
  name: string;
  category: 'Hotel' | 'Food' | 'Transport' | 'Shopping' | 'Activities' | 'Tickets' | 'Guide' | 'Other';
  amount: number;
  date: string;
  notes?: string;
  dayNumber?: number;
}

export interface AlternativePlaceSuggestion {
  id: string;
  originalPlaceName: string;
  alternativeName: string;
  category: string;
  location: string;
  distance: string;
  estimatedCost: number;
  duration: string;
  openHours: string;
  whyRecommended: string;
}

export interface BudgetOptimizationSuggestion {
  category: 'hotel' | 'transport' | 'activities' | 'food' | 'shopping';
  title: string;
  description: string;
  originalCost: number;
  reducedCost: number;
  savings: number;
  actionableStep: string;
}

export interface WhatIfSimulation {
  changeSummary: string;
  originalBudget: number;
  newEstimatedBudget: number;
  difference: number;
  isSaving: boolean;
  impactNotes: string[];
  suggestedAdjustments: string[];
}

export interface TripPlan {
  id: string;
  destination: string;
  startingLocation: string;
  departureDate: string;
  returnDate: string;
  durationDays: number;
  travelers: number;
  adults: number;
  children: number;
  budget: number;
  currency: string;
  hotelPreference: HotelRatingTier;
  foodPreference: FoodPreferenceTier;
  transportation: TransportationMode;
  interests: string[];
  tripStyle: TripStyle;
  specialRequirements: string;
  weatherSummary: string;
  places: TouristPlace[];
  hotels: HotelRecommendation[];
  restaurants: RestaurantRecommendation[];
  shopping: ShoppingSpot[];
  guides: TouristGuide[];
  itinerary: DayPlan[];
  budgetBreakdown: BudgetBreakdown;
  expenses: ExpenseItem[];
  savedPlaces: string[]; // place ids
  savedHotels: string[];
  savedRestaurants: string[];
  alternativeSuggestions: AlternativePlaceSuggestion[];
  currentTripDay: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actionTriggered?: {
    type: 'ADD_PLACE' | 'REMOVE_PLACE' | 'REPLACE_ACTIVITY' | 'ADD_EXPENSE' | 'UPDATE_BUDGET' | 'REPLAN' | 'CHANGE_HOTEL';
    payload?: any;
    statusText?: string;
  };
  suggestedQuestions?: string[];
}
