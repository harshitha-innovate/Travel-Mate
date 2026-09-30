/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { defaultGoaTrip } from './data/defaultTrip';
import { TripPlan, TripFormData, ActivityItem, ExpenseItem, TouristPlace, RestaurantRecommendation, ShoppingSpot, ChatMessage } from './types/travel';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { TripPlanningForm } from './components/TripPlanningForm';
import { TravelDashboard } from './components/TravelDashboard';
import { ItineraryView } from './components/ItineraryView';
import { ExplorePlaces } from './components/ExplorePlaces';
import { BudgetPlanner } from './components/BudgetPlanner';
import { ExpenseTracker } from './components/ExpenseTracker';
import { TripTracker } from './components/TripTracker';
import { TravelChatbot } from './components/TravelChatbot';
import { N8nIntegrationHub } from './components/N8nIntegrationHub';
import { generateTravelPlan } from './services/api';
import { Sparkles, MessageCircle, Bot } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentTrip, setCurrentTrip] = useState<TripPlan>(defaultGoaTrip);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isN8nModalOpen, setIsN8nModalOpen] = useState<boolean>(false);

  // Form submission handler to generate trip with Gemini AI
  const handleGeneratePlan = async (formData: TripFormData) => {
    setIsGeneratingPlan(true);
    try {
      const generatedTrip = await generateTravelPlan(formData);
      setCurrentTrip(generatedTrip);
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Plan generation failed, fallback to local plan:', error);
      setActiveTab('dashboard');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Reset to the exact Goa demo plan
  const handleLoadDemoGoa = () => {
    setCurrentTrip({
      ...defaultGoaTrip,
      id: `trip-demo-${Date.now()}`,
    });
    setActiveTab('dashboard');
  };

  // Update activity status (completed, skipped, pending)
  const handleUpdateActivityStatus = (
    dayNumber: number,
    activityId: string,
    status: 'pending' | 'completed' | 'skipped'
  ) => {
    setCurrentTrip((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day) => {
        if (day.dayNumber !== dayNumber) return day;
        return {
          ...day,
          activities: day.activities.map((act) =>
            act.id === activityId ? { ...act, status } : act
          ),
        };
      }),
    }));
  };

  // Replace an activity (e.g. missed Fort Aguada -> Reis Magos Fort)
  const handleReplaceActivity = (
    dayNumber: number,
    oldActivityId: string,
    newTitle: string,
    newCost: number,
    newNotes: string
  ) => {
    setCurrentTrip((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day) => {
        if (day.dayNumber !== dayNumber) return day;
        return {
          ...day,
          activities: day.activities.map((act) => {
            if (act.id !== oldActivityId) return act;
            return {
              ...act,
              title: newTitle,
              estimatedCost: newCost,
              notes: newNotes,
              isAlternative: true,
              originalActivityTitle: act.title,
              status: 'pending',
            };
          }),
        };
      }),
    }));
  };

  // Add a new activity to itinerary
  const handleAddActivity = (dayNumber: number, activity: ActivityItem) => {
    setCurrentTrip((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day) => {
        if (day.dayNumber !== dayNumber) return day;
        return {
          ...day,
          activities: [...day.activities, activity],
        };
      }),
    }));
  };

  // Add place from Explore section to itinerary
  const handleAddPlaceToItinerary = (place: TouristPlace) => {
    const targetDay = currentTrip.currentTripDay || 1;
    const newAct: ActivityItem = {
      id: `act-place-${Date.now()}`,
      timeSlot: 'Afternoon',
      time: '03:00 PM',
      title: place.name,
      activityType: 'attraction',
      location: place.location,
      duration: place.estimatedDuration,
      estimatedCost: place.estimatedEntryFee,
      travelTimeFromPrevious: place.distanceFromPrevious,
      transportationMode: 'Cab',
      notes: place.whyRecommended,
      status: 'pending',
    };
    handleAddActivity(targetDay, newAct);
    alert(`Added "${place.name}" to Day ${targetDay} Itinerary!`);
  };

  // Add restaurant to itinerary
  const handleAddRestaurantToTrip = (restaurant: RestaurantRecommendation) => {
    const targetDay = currentTrip.currentTripDay || 1;
    const newAct: ActivityItem = {
      id: `act-dining-${Date.now()}`,
      timeSlot: 'Dinner',
      time: '08:00 PM',
      title: `Dinner at ${restaurant.name}`,
      activityType: 'food',
      location: restaurant.location,
      duration: '1.5 hours',
      estimatedCost: restaurant.estimatedCostPerMeal * currentTrip.travelers,
      travelTimeFromPrevious: restaurant.distance,
      transportationMode: 'Cab / Walking',
      notes: `Signature: ${restaurant.localDishes.slice(0, 2).join(', ')}`,
      status: 'pending',
    };
    handleAddActivity(targetDay, newAct);
    alert(`Added dinner reservation at "${restaurant.name}" to Day ${targetDay}!`);
  };

  // Add shopping stop to itinerary
  const handleAddShoppingToTrip = (spot: ShoppingSpot) => {
    const targetDay = currentTrip.currentTripDay || 1;
    const newAct: ActivityItem = {
      id: `act-shop-${Date.now()}`,
      timeSlot: 'Evening',
      time: '05:30 PM',
      title: `Shopping at ${spot.name}`,
      activityType: 'shopping',
      location: spot.location,
      duration: '2 hours',
      estimatedCost: 1000,
      travelTimeFromPrevious: '15 min drive',
      transportationMode: 'Cab',
      notes: `Specialties: ${spot.specialties.slice(0, 2).join(', ')}`,
      status: 'pending',
    };
    handleAddActivity(targetDay, newAct);
    alert(`Added shopping stop at "${spot.name}" to Day ${targetDay}!`);
  };

  // Select hotel
  const handleSelectHotel = (hotelId: string) => {
    setCurrentTrip((prev) => ({
      ...prev,
      hotels: prev.hotels.map((h) => ({
        ...h,
        isSelected: h.id === hotelId,
      })),
    }));
  };

  // Log new expense
  const handleAddExpense = (expense: Omit<ExpenseItem, 'id'>) => {
    const newExpenseItem: ExpenseItem = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    setCurrentTrip((prev) => ({
      ...prev,
      expenses: [newExpenseItem, ...prev.expenses],
    }));
  };

  // Delete expense
  const handleDeleteExpense = (expenseId: string) => {
    setCurrentTrip((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== expenseId),
    }));
  };

  // Apply AI budget optimization
  const handleApplyOptimizedBudget = (
    savings: number,
    newTotal: number,
    newBreakdown: any
  ) => {
    setCurrentTrip((prev) => ({
      ...prev,
      budget: newTotal,
      budgetBreakdown: newBreakdown || {
        ...prev.budgetBreakdown,
        totalEstimated: newTotal,
      },
    }));
    alert(`Applied AI optimization: New budget is ${currentTrip.currency}${newTotal.toLocaleString()} (Saved ${currentTrip.currency}${savings.toLocaleString()})`);
  };

  // Apply What-If scenario
  const handleApplyWhatIfScenario = (newBudget: number, newBreakdown?: any) => {
    setCurrentTrip((prev) => ({
      ...prev,
      budget: newBudget,
      budgetBreakdown: newBreakdown || {
        ...prev.budgetBreakdown,
        totalEstimated: newBudget,
      },
    }));
    alert(`What-If plan applied: Budget updated to ${currentTrip.currency}${newBudget.toLocaleString()}`);
  };

  // Execute chatbot triggered actions in real time
  const handleExecuteChatAction = (action: NonNullable<ChatMessage['actionTriggered']>) => {
    if (!action) return;

    if (action.type === 'ADD_EXPENSE' && action.payload) {
      handleAddExpense({
        name: action.payload.name || 'Trip Expense',
        category: action.payload.category || 'Food',
        amount: Number(action.payload.amount) || 800,
        date: new Date().toISOString().split('T')[0],
        notes: action.payload.notes || 'Added by TravelMate AI Chatbot',
        dayNumber: currentTrip.currentTripDay,
      });
    }

    if (action.type === 'REPLACE_ACTIVITY' && action.payload) {
      const targetDay = currentTrip.currentTripDay || 2;
      const dayData = currentTrip.itinerary.find((d) => d.dayNumber === targetDay);
      const targetAct = dayData?.activities.find((a) =>
        a.title.toLowerCase().includes('fort aguada') || a.title.toLowerCase().includes('aguada')
      ) || dayData?.activities[0];

      if (targetAct) {
        handleReplaceActivity(
          targetDay,
          targetAct.id,
          action.payload.replacementTitle || 'Reis Magos Fort & Cultural Bastion',
          50,
          action.payload.reason || 'Nearby alternative with river views, open now'
        );
      }
    }

    if (action.type === 'REPLAN') {
      // Replan to remove beaches and insert heritage/art
      setCurrentTrip((prev) => ({
        ...prev,
        interests: prev.interests.filter((i) => i !== 'Beaches').concat(['Heritage', 'Art & Culture']),
        itinerary: prev.itinerary.map((day) => {
          if (day.dayNumber === 1) {
            return {
              ...day,
              theme: 'Arrival & Panjim Latin Quarter Heritage Walk',
              activities: day.activities.map((a) =>
                a.title.includes('Beach')
                  ? {
                      ...a,
                      title: 'Museum of Goa (MOG) & Contemporary Art Walk',
                      location: 'Pilerne',
                      notes: 'Replaced beach with indoor cultural sculpture gallery',
                      isAlternative: true,
                    }
                  : a
              ),
            };
          }
          if (day.dayNumber === 2) {
            return {
              ...day,
              theme: 'Heritage Forts & Fontainhas Portuguese Walk',
              activities: day.activities.map((a) =>
                a.title.includes('Beach') || a.title.includes('Baga')
                  ? {
                      ...a,
                      title: 'Fontainhas Art Cafe & Heritage Bakery Stroll',
                      location: 'Panaji Latin Quarter',
                      notes: 'Replaced beach activity with historic colonial architectural walk',
                      isAlternative: true,
                    }
                  : a
              ),
            };
          }
          return day;
        }),
      }));
    }

    if (action.type === 'UPDATE_BUDGET' && action.payload) {
      const newBud = Number(action.payload.newBudget) || 25000;
      setCurrentTrip((prev) => ({
        ...prev,
        budget: newBud,
        budgetBreakdown: {
          hotel: Math.round(newBud * 0.4),
          transport: Math.round(newBud * 0.2),
          food: Math.round(newBud * 0.18),
          activities: Math.round(newBud * 0.1),
          shopping: Math.round(newBud * 0.05),
          emergencyBuffer: Math.round(newBud * 0.07),
          totalEstimated: newBud,
        },
      }));
    }

    if (action.type === 'ADD_PLACE' && action.payload) {
      const dayNum = action.payload.dayNumber || 2;
      const act = action.payload.activity || {
        id: `act-chat-${Date.now()}`,
        timeSlot: 'Evening',
        time: '05:00 PM',
        title: 'Baga Beach Boardwalk & Sunset',
        activityType: 'attraction',
        location: 'Baga, North Goa',
        duration: '2 hours',
        estimatedCost: 300,
        travelTimeFromPrevious: '15 min drive',
        transportationMode: 'Cab',
        notes: 'Added via TravelMate Chat',
        status: 'pending',
      };
      handleAddActivity(dayNum, act);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        destinationName={currentTrip.destination}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenN8nModal={() => setIsN8nModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'home' && (
          <HomePage
            onPlanTripClick={() => setActiveTab('plan')}
            onAskChatClick={() => setIsChatOpen(true)}
            onTrackTripClick={() => setActiveTab('tracker')}
            onLoadDemoGoa={handleLoadDemoGoa}
            currentTrip={currentTrip}
          />
        )}

        {activeTab === 'plan' && (
          <TripPlanningForm
            initialData={{
              destination: currentTrip.destination,
              startingLocation: currentTrip.startingLocation,
              departureDate: currentTrip.departureDate,
              returnDate: currentTrip.returnDate,
              adults: currentTrip.adults,
              children: currentTrip.children,
              totalBudget: currentTrip.budget,
              currency: currentTrip.currency,
              hotelPreference: currentTrip.hotelPreference,
              foodPreference: currentTrip.foodPreference,
              transportation: currentTrip.transportation,
              interests: currentTrip.interests,
              tripStyle: currentTrip.tripStyle,
              specialRequirements: currentTrip.specialRequirements,
            }}
            onSubmit={handleGeneratePlan}
            isLoading={isGeneratingPlan}
          />
        )}

        {activeTab === 'dashboard' && (
          <TravelDashboard
            trip={currentTrip}
            onNavigateTab={setActiveTab}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryView
            trip={currentTrip}
            onUpdateActivityStatus={handleUpdateActivityStatus}
            onReplaceActivity={handleReplaceActivity}
            onAddActivity={handleAddActivity}
            onReplanTrip={() => setActiveTab('plan')}
            onRequestAlternativeForActivity={(placeName) => {
              setIsChatOpen(true);
            }}
          />
        )}

        {activeTab === 'explore' && (
          <ExplorePlaces
            trip={currentTrip}
            onSelectHotel={handleSelectHotel}
            onAddPlaceToItinerary={handleAddPlaceToItinerary}
            onAddRestaurantToTrip={handleAddRestaurantToTrip}
            onAddShoppingToTrip={handleAddShoppingToTrip}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetPlanner
            trip={currentTrip}
            onApplyOptimizedBudget={handleApplyOptimizedBudget}
            onApplyWhatIfScenario={handleApplyWhatIfScenario}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpenseTracker
            trip={currentTrip}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {activeTab === 'tracker' && (
          <TripTracker
            trip={currentTrip}
            onUpdateActivityStatus={handleUpdateActivityStatus}
            onReplaceActivity={handleReplaceActivity}
          />
        )}
      </main>

      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-teal-600 hover:bg-teal-700 text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl transition-transform active:scale-95 flex items-center justify-center cursor-pointer group"
        title="Ask TravelMate AI Chatbot"
      >
        <Bot className="w-6 h-6 transition-transform group-hover:scale-110" />
        <span className="sr-only">Ask TravelMate AI</span>
      </button>

      {/* AI Travel Chatbot Drawer */}
      <TravelChatbot
        trip={currentTrip}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onExecuteChatAction={handleExecuteChatAction}
      />

      {/* n8n Webhook Architecture Hub Modal */}
      <N8nIntegrationHub
        isOpen={isN8nModalOpen}
        onClose={() => setIsN8nModalOpen(false)}
        currentTrip={currentTrip}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 TravelMate AI · Plan Smarter. Travel Better.</p>
          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={() => setIsN8nModalOpen(true)}
              className="hover:text-teal-700 font-medium"
            >
              n8n Webhook Architecture
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleLoadDemoGoa}
              className="hover:text-teal-700 font-medium"
            >
              Reset Demo Scenario (Goa)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
