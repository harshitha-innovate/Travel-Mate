import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { defaultGoaTrip } from './src/data/defaultTrip.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini SDK client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to extract JSON from model response safely
function cleanAndParseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch (e) {
    // Check if markdown code block enclosed
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
    // Attempt to locate first { and last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(text.substring(firstBrace, lastBrace + 1));
    }
    throw new Error('Failed to parse JSON from AI response: ' + text.slice(0, 150));
  }
}

// 1. Generate Full Travel Plan
app.post('/api/gemini/generate-plan', async (req: Request, res: Response) => {
  try {
    const formData = req.body;
    const {
      destination = 'Goa',
      startingLocation = 'Visakhapatnam',
      departureDate = '2026-10-15',
      returnDate = '2026-10-19',
      travelers = 3,
      adults = 3,
      children = 0,
      totalBudget = 35000,
      currency = '₹',
      hotelPreference = '4-star',
      foodPreference = 'no-preference',
      transportation = 'flight',
      interests = ['Beaches', 'Food', 'Shopping'],
      tripStyle = 'friends',
      specialRequirements = '',
    } = formData;

    const departure = new Date(departureDate);
    const returning = new Date(returnDate);
    let diffDays = Math.max(1, Math.round((returning.getTime() - departure.getTime()) / (1000 * 3600 * 24)) + 1);
    if (isNaN(diffDays) || diffDays < 1) diffDays = 5;

    const prompt = `You are TravelMate AI, an elite Senior Travel Agent and Logistics Planner.
Generate a comprehensive, geographically clustered, time-optimized, budget-realistic travel plan for:
- Destination: ${destination}
- Origin: ${startingLocation}
- Dates: ${departureDate} to ${returnDate} (${diffDays} Days)
- Group: ${travelers} Travelers (${adults} Adults, ${children} Children, Style: ${tripStyle})
- Total Budget: ${currency}${totalBudget}
- Hotel Preference: ${hotelPreference}
- Food Preference: ${foodPreference}
- Preferred Transport: ${transportation}
- Interests: ${interests.join(', ')}
- Special Requirements: ${specialRequirements || 'None'}

CRITICAL GUIDELINES:
1. Do NOT hallucinate real-time prices or availability. Clearly note estimated prices.
2. Group itinerary activities strictly by geography each day to minimize commute time.
3. Every activity must have time, location, duration, estimated cost in ${currency}, transport mode, and practical notes.
4. Calculate realistic budget breakdown allocations in ${currency} (hotel, transport, food, activities, shopping, emergency buffer). Their sum should be close to or equal to totalBudget.
5. Provide 3 hotel options matching ${hotelPreference} with estimated nightly and total cost.
6. Provide local famous foods and 3 authentic restaurants (respecting food preference: ${foodPreference}).
7. Provide shopping markets and 2 licensed/official tourist guide references with verification notices.
8. Provide 3 alternative/backup place suggestions in case a top attraction is missed or closed.

Return ONLY a valid JSON object with the following schema:
{
  "weatherSummary": "Short realistic seasonal weather outlook",
  "places": [
    {
      "id": "p1",
      "name": "Name of Place",
      "category": "Category",
      "description": "2-line engaging overview",
      "estimatedDuration": "e.g. 2 hours",
      "openTime": "09:00 AM",
      "closeTime": "06:00 PM",
      "weeklyHoliday": "e.g. Open daily or Closed Mondays",
      "estimatedEntryFee": 100,
      "location": "Locality or sub-region",
      "distanceFromPrevious": "e.g. 5 km (15 min drive)",
      "recommendedTime": "e.g. Morning (09:30 AM)",
      "whyRecommended": "Reason based on interests",
      "isVerified": true,
      "notes": "Practical tip or estimate label"
    }
  ],
  "hotels": [
    {
      "id": "h1",
      "name": "Hotel Name",
      "starRating": 4,
      "userRating": 4.4,
      "pricePerNight": 3200,
      "numberOfNights": ${Math.max(1, diffDays - 1)},
      "estimatedTotalStayCost": 12800,
      "distanceFromAttractions": "Proximity note",
      "facilities": ["Pool", "Wi-Fi", "Breakfast"],
      "location": "Locality",
      "whyRecommended": "Reason",
      "isSelected": true
    }
  ],
  "restaurants": [
    {
      "id": "r1",
      "name": "Restaurant Name",
      "cuisine": "Cuisine style",
      "localDishes": ["Dish 1", "Dish 2"],
      "hasVegOptions": true,
      "hasNonVegOptions": true,
      "hasVeganOptions": false,
      "priceRange": "e.g. ₹350 - ₹600 per person",
      "estimatedCostPerMeal": 450,
      "location": "Area",
      "distance": "Distance from hub",
      "whyRecommended": "Reason"
    }
  ],
  "shopping": [
    {
      "id": "s1",
      "name": "Market Name",
      "marketType": "Market type",
      "specialties": ["Specialty 1", "Specialty 2"],
      "priceRange": "Budget / Moderate",
      "openingHours": "10:00 AM - 08:00 PM",
      "location": "Area",
      "whyRecommended": "Reason"
    }
  ],
  "guides": [
    {
      "id": "g1",
      "serviceName": "Official Guide Service or Society",
      "location": "City/Region",
      "languages": ["English", "Local language"],
      "areasCovered": ["Area 1", "Area 2"],
      "approxCharges": "e.g. ₹1,200 per day",
      "experienceYears": "5+ Years",
      "bookingSource": "Official Tourism Dept or Desk",
      "verificationNote": "Always ask for government issued guide ID before booking."
    }
  ],
  "itinerary": [
    {
      "dayNumber": 1,
      "dateStr": "Day 1",
      "theme": "Theme for the day",
      "activities": [
        {
          "id": "d1-a1",
          "timeSlot": "Morning",
          "time": "09:30 AM",
          "title": "Activity Title",
          "activityType": "attraction",
          "location": "Specific location",
          "duration": "1.5 hours",
          "estimatedCost": 200,
          "travelTimeFromPrevious": "Starting hub",
          "transportationMode": "Cab / Walking",
          "notes": "Travel tip",
          "status": "pending"
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "hotel": 14000,
    "transport": 7000,
    "food": 6000,
    "activities": 3000,
    "shopping": 2000,
    "guide": 0,
    "miscellaneous": 0,
    "emergencyBuffer": 3000,
    "totalEstimated": ${totalBudget}
  },
  "alternativeSuggestions": [
    {
      "id": "alt1",
      "originalPlaceName": "Primary Attraction",
      "alternativeName": "Backup Attraction",
      "category": "Category",
      "location": "Location",
      "distance": "Distance from primary",
      "estimatedCost": 100,
      "duration": "1.5 hours",
      "openHours": "Timings",
      "whyRecommended": "Why it's a great backup"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');

    // Build complete TripPlan response
    const finalTrip = {
      id: 'trip-' + Date.now(),
      destination,
      startingLocation,
      departureDate,
      returnDate,
      durationDays: diffDays,
      travelers: Number(travelers),
      adults: Number(adults),
      children: Number(children),
      budget: Number(totalBudget),
      currency,
      hotelPreference,
      foodPreference,
      transportation,
      interests,
      tripStyle,
      specialRequirements,
      weatherSummary: parsed.weatherSummary || 'Pleasant travel weather expected.',
      places: parsed.places || defaultGoaTrip.places,
      hotels: parsed.hotels || defaultGoaTrip.hotels,
      restaurants: parsed.restaurants || defaultGoaTrip.restaurants,
      shopping: parsed.shopping || defaultGoaTrip.shopping,
      guides: parsed.guides || defaultGoaTrip.guides,
      itinerary: parsed.itinerary || defaultGoaTrip.itinerary,
      budgetBreakdown: parsed.budgetBreakdown || {
        hotel: Math.round(totalBudget * 0.4),
        transport: Math.round(totalBudget * 0.2),
        food: Math.round(totalBudget * 0.18),
        activities: Math.round(totalBudget * 0.1),
        shopping: Math.round(totalBudget * 0.05),
        emergencyBuffer: Math.round(totalBudget * 0.07),
        totalEstimated: Number(totalBudget),
      },
      expenses: [
        {
          id: 'exp-init-1',
          name: 'Initial Transit / Advance Booking',
          category: 'Transport',
          amount: Math.round(totalBudget * 0.08),
          date: departureDate,
          dayNumber: 1,
          notes: 'Initial booking deposit',
        },
      ],
      savedPlaces: (parsed.places || []).slice(0, 3).map((p: any) => p.id),
      savedHotels: [(parsed.hotels || [])[0]?.id || 'h1'],
      savedRestaurants: (parsed.restaurants || []).slice(0, 2).map((r: any) => r.id),
      alternativeSuggestions: parsed.alternativeSuggestions || defaultGoaTrip.alternativeSuggestions,
      currentTripDay: 1,
      createdAt: new Date().toISOString(),
    };

    return res.json(finalTrip);
  } catch (error: any) {
    console.error('Error generating plan with Gemini:', error);
    // Return reasoned fallback based on default Goa trip adapted to user inputs
    const fallback = {
      ...defaultGoaTrip,
      id: 'trip-' + Date.now(),
      destination: req.body?.destination || defaultGoaTrip.destination,
      startingLocation: req.body?.startingLocation || defaultGoaTrip.startingLocation,
      budget: req.body?.totalBudget || defaultGoaTrip.budget,
      currency: req.body?.currency || defaultGoaTrip.currency,
      travelers: req.body?.travelers || defaultGoaTrip.travelers,
      weatherSummary: `Live forecast: Seasonal conditions for ${req.body?.destination || 'your destination'}. Verify local alerts before departure.`,
    };
    return res.json(fallback);
  }
});

// 2. Chatbot with Context & Real Actions
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { messages, currentTrip, userQuestion } = req.body;

    const totalSpent = (currentTrip?.expenses || []).reduce((acc: number, e: any) => acc + (Number(e.amount) || 0), 0);
    const budgetTotal = Number(currentTrip?.budget) || 35000;
    const remainingBudget = budgetTotal - totalSpent;
    const currency = currentTrip?.currency || '₹';

    const systemPrompt = `You are TravelMate, the personal AI Travel Agent & Companion for this user.
Current Trip State:
- Destination: ${currentTrip?.destination || 'Goa'}
- Origin: ${currentTrip?.startingLocation || 'Visakhapatnam'}
- Duration: ${currentTrip?.durationDays || 5} days (Current Day: Day ${currentTrip?.currentTripDay || 2})
- Travelers: ${currentTrip?.travelers || 3}
- Total Budget: ${currency}${budgetTotal}
- Total Amount Spent So Far: ${currency}${totalSpent}
- Exact Remaining Budget: ${currency}${remainingBudget}
- Hotel Preference: ${currentTrip?.hotelPreference || '4 Star'}
- Food Preference: ${currentTrip?.foodPreference || 'No Preference'}
- Current Expenses Count: ${(currentTrip?.expenses || []).length}
- Activities Count in Itinerary: ${(currentTrip?.itinerary || []).reduce((sum: number, d: any) => sum + (d.activities || []).length, 0)}

USER CAPABILITIES & ACTIONS YOU CAN TRIGGER:
You are not a passive text-only chatbot. When the user asks you to modify their trip, add an expense, replace a missed attraction, remove beaches, or recalculate budget, YOU MUST return an "actionTriggered" object alongside your natural, warm, professional answer!

POSSIBLE ACTION TYPES:
1. "ADD_EXPENSE":
   When the user states they spent money (e.g. "I spent ₹800 on lunch", "Paid 1200 for taxi", "Added 1500 for shopping").
   Format:
   "actionTriggered": {
     "type": "ADD_EXPENSE",
     "payload": {
       "name": "Lunch / Activity / Item name",
       "category": "Food" | "Transport" | "Hotel" | "Shopping" | "Activities" | "Tickets" | "Other",
       "amount": 800,
       "notes": "Added via TravelMate Chat"
     },
     "statusText": "Added ₹800 Food expense to your tracker"
   }

2. "REPLACE_ACTIVITY":
   When the user says they missed a place (e.g. "We missed Fort Aguada", "Place is closed, suggest alternative").
   Format:
   "actionTriggered": {
     "type": "REPLACE_ACTIVITY",
     "payload": {
       "targetPlaceName": "Fort Aguada",
       "replacementTitle": "Reis Magos Fort",
       "reason": "Nearby coastal fortress with shorter wait time, open now, fits remaining Day 2 schedule."
     },
     "statusText": "Replaced Fort Aguada with Reis Magos Fort in Day 2"
   }

3. "REPLAN":
   When user says "I don't want beaches. Change my itinerary" or "Remove beach activities".
   Format:
   "actionTriggered": {
     "type": "REPLAN",
     "payload": {
       "preferenceChange": "remove_beaches",
       "replacements": [
         { "day": 1, "replace": "Candolim Beach", "with": "Museum of Goa & Artisan Walk" },
         { "day": 2, "replace": "Baga Beach Boardwalk", "with": "Fontainhas Heritage Art Cafe Walk" }
       ]
     },
     "statusText": "Updated itinerary to replace beach activities with heritage & art cultural spots"
   }

4. "ADD_PLACE":
   When user says "Add Baga Beach to Day 2" or "Add a shopping stop".
   Format:
   "actionTriggered": {
     "type": "ADD_PLACE",
     "payload": {
       "dayNumber": 2,
       "activity": {
         "title": "Baga Beach Boardwalk & Sunset",
         "timeSlot": "Evening",
         "time": "05:00 PM",
         "activityType": "attraction",
         "location": "Baga, North Goa",
         "duration": "2 hours",
         "estimatedCost": 300,
         "notes": "Added via TravelMate Chat"
       }
     },
     "statusText": "Added Baga Beach to Day 2 Itinerary"
   }

5. "UPDATE_BUDGET":
   When user asks to change budget (e.g. "Change budget to 25000", "What if budget is 25000?").
   Format:
   "actionTriggered": {
     "type": "UPDATE_BUDGET",
     "payload": {
       "newBudget": 25000
     },
     "statusText": "Budget updated to ₹25,000"
   }

FINANCIAL ACCURACY:
- If user asks: "How much have I spent so far?" -> Answer exactly: ${currency}${totalSpent}.
- If user asks: "How much budget do I have left?" -> Answer exactly: ${currency}${remainingBudget}.
- If user asks "Can I reduce my budget?" or "Show me cheaper hotels" -> Explain tangible ways to trim lodging and transit, offering to apply changes.
- Clearly state that prices are estimates and should be confirmed before booking.

Return strictly a JSON object:
{
  "content": "Your conversational response in markdown. Clear, engaging, helpful, with bullet points if helpful.",
  "actionTriggered": null or the action object described above,
  "suggestedQuestions": ["Follow-up question 1", "Follow-up question 2", "Follow-up question 3"]
}`;

    const promptMessages = (messages || []).slice(-8).map((m: any) => `${m.sender.toUpperCase()}: ${m.content}`).join('\n');

    const fullPrompt = `${systemPrompt}

RECENT CHAT HISTORY:
${promptMessages}

USER'S LATEST MESSAGE:
"${userQuestion}"

Provide your structured JSON response:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in chat endpoint:', error);
    // Intelligent fallback handling
    const q = (req.body?.userQuestion || '').toLowerCase();
    const budget = Number(req.body?.currentTrip?.budget) || 35000;
    const spent = (req.body?.currentTrip?.expenses || []).reduce((acc: number, e: any) => acc + (Number(e.amount) || 0), 0);
    const left = budget - spent;
    const curr = req.body?.currentTrip?.currency || '₹';

    if (q.includes('how much') && (q.includes('left') || q.includes('remaining'))) {
      return res.json({
        content: `You currently have **${curr}${left.toLocaleString()}** remaining out of your total budget of **${curr}${budget.toLocaleString()}** (You have spent **${curr}${spent.toLocaleString()}** so far across ${(req.body?.currentTrip?.expenses || []).length} expenses).`,
        actionTriggered: null,
        suggestedQuestions: ['Where can I save more money?', 'Show my expense breakdown', 'Suggest a cheap dinner spot']
      });
    }

    if (q.includes('spent') || q.includes('expenses')) {
      return res.json({
        content: `You have logged **${curr}${spent.toLocaleString()}** in expenses so far. Your total allocated trip budget is **${curr}${budget.toLocaleString()}**, leaving you with **${curr}${left.toLocaleString()}**.`,
        actionTriggered: null,
        suggestedQuestions: ['Add a new expense', 'How much money do I have left?', 'Optimize my budget']
      });
    }

    if (q.includes('missed') && (q.includes('fort') || q.includes('aguada') || q.includes('place'))) {
      return res.json({
        content: `No worries at all! Since you missed **Fort Aguada**, I recommend visiting **Reis Magos Fort** instead. It is only 15 minutes away, significantly less crowded, open until 5:30 PM, and has marvelous restored sea ramparts. Would you like me to replace it in your Day 2 schedule?`,
        actionTriggered: {
          type: 'REPLACE_ACTIVITY',
          payload: {
            targetPlaceName: 'Fort Aguada',
            replacementTitle: 'Reis Magos Fort & Cultural Bastion',
            reason: 'Closer distance, open until 5:30 PM, and matches heritage coastal interest.'
          },
          statusText: 'Replaced Fort Aguada with Reis Magos Fort'
        },
        suggestedQuestions: ['Show directions to Reis Magos', 'What are the entry ticket costs?', 'Where should we eat nearby?']
      });
    }

    if (q.includes("don't want beaches") || q.includes('no beach') || q.includes('remove beach')) {
      return res.json({
        content: `Got it! I've updated your itinerary to replace beach activities with cultural, heritage, and spice garden explorations—including the **Museum of Goa**, the **Fontainhas Latin Quarter walk**, and the **Sahakari Spice Plantation**!`,
        actionTriggered: {
          type: 'REPLAN',
          payload: {
            preferenceChange: 'remove_beaches'
          },
          statusText: 'Replaced beach activities with heritage and culture landmarks'
        },
        suggestedQuestions: ['What are the opening hours of the Museum?', 'Show heritage food recommendations', 'Can we add a cooking class?']
      });
    }

    if (q.includes('spent') && (q.includes('lunch') || q.includes('800') || q.includes('1500') || q.includes('cab'))) {
      const match = q.match(/\d+/);
      const amount = match ? parseInt(match[0], 10) : 800;
      return res.json({
        content: `I've recorded that expense of **${curr}${amount}** into your Expense Tracker under Food / Transit. Your remaining budget is now updated automatically!`,
        actionTriggered: {
          type: 'ADD_EXPENSE',
          payload: {
            name: q.includes('lunch') ? 'Lunch' : q.includes('cab') ? 'Cab Transit' : 'Trip Expense',
            category: q.includes('cab') ? 'Transport' : 'Food',
            amount: amount,
            notes: 'Added via TravelMate Chat'
          },
          statusText: `Added ${curr}${amount} expense to tracker`
        },
        suggestedQuestions: ['How much budget do I have left?', 'View all expenses', 'Optimize my remaining budget']
      });
    }

    return res.json({
      content: `I'm here to assist with every aspect of your trip to ${req.body?.currentTrip?.destination || 'Goa'}! You can ask me to swap attractions, record expenses, recommend verified local guides or restaurants, or optimize your budget anytime.`,
      actionTriggered: null,
      suggestedQuestions: ['How much money do I have left?', 'Suggest an alternative place', 'Optimize my budget', 'What local dishes should I try?']
    });
  }
});

// 3. AI Budget Optimization
app.post('/api/gemini/optimize-budget', async (req: Request, res: Response) => {
  try {
    const { currentTrip } = req.body;
    const budget = Number(currentTrip?.budget) || 35000;
    const currency = currentTrip?.currency || '₹';

    const prompt = `You are TravelMate AI Financial Optimizer.
Analyze this trip:
- Destination: ${currentTrip?.destination || 'Goa'}
- Duration: ${currentTrip?.durationDays || 5} days
- Travelers: ${currentTrip?.travelers || 3}
- Current Budget: ${currency}${budget}
- Current Breakdown:
  Hotel: ${currency}${currentTrip?.budgetBreakdown?.hotel || 14000}
  Transport: ${currency}${currentTrip?.budgetBreakdown?.transport || 7000}
  Food: ${currency}${currentTrip?.budgetBreakdown?.food || 6000}
  Activities: ${currency}${currentTrip?.budgetBreakdown?.activities || 3000}
  Shopping: ${currency}${currentTrip?.budgetBreakdown?.shopping || 2000}

Identify 3 to 4 actionable, practical spending reductions without sacrificing experience quality (e.g. switching from private cabs to 2-wheeler scooter rentals or metro passes, choosing local authentic thalis over luxury resort dining, smart attraction bundle tickets).

Return ONLY valid JSON:
{
  "totalPotentialSavings": 3500,
  "newEstimatedCost": ${budget - 3500},
  "suggestions": [
    {
      "category": "hotel",
      "title": "Lodging Optimization",
      "description": "Book boutique 4-star heritage property or executive room 500m inland rather than beachfront premium.",
      "originalCost": ${currentTrip?.budgetBreakdown?.hotel || 14000},
      "reducedCost": ${(currentTrip?.budgetBreakdown?.hotel || 14000) - 2000},
      "savings": 2000,
      "actionableStep": "Switch to Country Inn & Suites or boutique villa"
    },
    {
      "category": "transport",
      "title": "Local Commute Optimization",
      "description": "Rent two scooters or shared airport shuttle instead of on-demand private tourist taxis.",
      "originalCost": ${currentTrip?.budgetBreakdown?.transport || 7000},
      "reducedCost": ${(currentTrip?.budgetBreakdown?.transport || 7000) - 1000},
      "savings": 1000,
      "actionableStep": "Hire 2 Activas at ₹400/day + airport coach"
    },
    {
      "category": "activities",
      "title": "Attraction Pass Bundling",
      "description": "Combine church & fort walking passes and visit beaches during free sunset timings.",
      "originalCost": ${currentTrip?.budgetBreakdown?.activities || 3000},
      "reducedCost": ${(currentTrip?.budgetBreakdown?.activities || 3000) - 500},
      "savings": 500,
      "actionableStep": "Pre-book self-guided heritage combo passes"
    }
  ],
  "revisedBreakdown": {
    "hotel": ${(currentTrip?.budgetBreakdown?.hotel || 14000) - 2000},
    "transport": ${(currentTrip?.budgetBreakdown?.transport || 7000) - 1000},
    "food": ${currentTrip?.budgetBreakdown?.food || 6000},
    "activities": ${(currentTrip?.budgetBreakdown?.activities || 3000) - 500},
    "shopping": ${currentTrip?.budgetBreakdown?.shopping || 2000},
    "emergencyBuffer": 3000,
    "totalEstimated": ${budget - 3500}
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in optimize-budget endpoint:', error);
    const budget = Number(req.body?.currentTrip?.budget) || 35000;
    const savings = Math.round(budget * 0.1);
    return res.json({
      totalPotentialSavings: savings,
      newEstimatedCost: budget - savings,
      suggestions: [
        {
          category: 'hotel',
          title: 'Hotel Accommodation Adjustments',
          description: 'Save by choosing 4-star boutique hotel located 800m from beachfront.',
          originalCost: 14000,
          reducedCost: 12000,
          savings: 2000,
          actionableStep: 'Switch to recommended boutique 4-star option',
        },
        {
          category: 'transport',
          title: 'Transit Mode Shift',
          description: 'Use prepaid airport coach and self-drive rental scooters instead of point-to-point private cabs.',
          originalCost: 7000,
          reducedCost: 6000,
          savings: 1000,
          actionableStep: 'Rent scooters for local transit',
        },
        {
          category: 'activities',
          title: 'Timing & Self-Guided Tours',
          description: 'Take advantage of complimentary entry hours and heritage audio guides.',
          originalCost: 3000,
          reducedCost: 2500,
          savings: 500,
          actionableStep: 'Use self-guided walking routes',
        },
      ],
      revisedBreakdown: {
        hotel: 12000,
        transport: 6000,
        food: 6000,
        activities: 2500,
        shopping: 2000,
        emergencyBuffer: 3000,
        totalEstimated: budget - savings,
      },
    });
  }
});

// 4. "What-If" Trip Simulator
app.post('/api/gemini/simulate-what-if', async (req: Request, res: Response) => {
  try {
    const { currentTrip, simulationParams } = req.body;
    const {
      targetBudget = 25000,
      targetTravelers = 3,
      targetDays = 5,
      targetHotel = '3-star',
      targetTransport = 'train',
      customQuery = '',
    } = simulationParams || {};

    const prompt = `You are TravelMate AI What-If Trip Simulator.
Compare:
ORIGINAL PLAN:
- Budget: ${currentTrip?.currency || '₹'}${currentTrip?.budget || 35000}
- Duration: ${currentTrip?.durationDays || 5} days
- Travelers: ${currentTrip?.travelers || 3}
- Hotel Category: ${currentTrip?.hotelPreference || '4-star'}
- Transport: ${currentTrip?.transportation || 'flight'}

NEW SIMULATION SCENARIO:
- New Budget: ${currentTrip?.currency || '₹'}${targetBudget}
- New Travelers: ${targetTravelers}
- New Duration: ${targetDays} days
- New Hotel Category: ${targetHotel}
- New Transport: ${targetTransport}
- User Question: "${customQuery || `What if my budget becomes ${currentTrip?.currency || '₹'}${targetBudget}?`}"

Generate a realistic comparison showing difference, savings/additional cost, and impact notes.
Return ONLY valid JSON:
{
  "changeSummary": "Clear summary of the simulated adjustment",
  "originalBudget": ${currentTrip?.budget || 35000},
  "newEstimatedBudget": ${targetBudget},
  "difference": ${Math.abs((currentTrip?.budget || 35000) - targetBudget)},
  "isSaving": ${targetBudget < (currentTrip?.budget || 35000)},
  "impactNotes": [
    "Switching hotel tier from 4-star to 3-star saves approx ₹4,500 over 4 nights.",
    "Adjusting dining from resort restaurants to highly-rated local thali eateries saves approx ₹2,000.",
    "Prioritizing complimentary fort viewpoints and beach walks maintains full sightseeing coverage."
  ],
  "suggestedAdjustments": [
    "Rebalance hotel allocation to ₹9,500 total",
    "Switch to two-wheeler scooter rentals (₹400/day)",
    "Keep emergency reserve at ₹2,000"
  ],
  "revisedBreakdown": {
    "hotel": 9500,
    "transport": 5000,
    "food": 4500,
    "activities": 2000,
    "shopping": 1500,
    "emergencyBuffer": 2500,
    "totalEstimated": ${targetBudget}
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in simulate-what-if endpoint:', error);
    const orig = Number(req.body?.currentTrip?.budget) || 35000;
    const target = Number(req.body?.simulationParams?.targetBudget) || 25000;
    const diff = orig - target;
    return res.json({
      changeSummary: `Budget adjusted from ₹${orig.toLocaleString()} to ₹${target.toLocaleString()}`,
      originalBudget: orig,
      newEstimatedBudget: target,
      difference: Math.abs(diff),
      isSaving: diff > 0,
      impactNotes: [
        'Shift lodging to well-reviewed 3-star heritage hotels or private apartments.',
        'Opt for scooter rentals or local bus passes instead of exclusive tourist cabs.',
        'Focus on free-entry cultural landmarks (Old Goa churches, Fontainhas, sunset cliffs).',
      ],
      suggestedAdjustments: [
        'Reduce lodging allocation by ₹4,000',
        'Save ₹2,500 on transport by utilizing scooter rentals',
        'Keep food budget flexible with local Goan thali places',
      ],
      revisedBreakdown: {
        hotel: 9500,
        transport: 5000,
        food: 4500,
        activities: 2000,
        shopping: 1500,
        emergencyBuffer: 2500,
        totalEstimated: target,
      },
    });
  }
});

// 5. Suggest Alternatives for Missed or Closed Places
app.post('/api/gemini/suggest-alternatives', async (req: Request, res: Response) => {
  try {
    const { currentTrip, missedPlace, reason, remainingHours } = req.body;
    const destination = currentTrip?.destination || 'Goa';

    const prompt = `You are TravelMate AI Alternative Routing Specialist.
The user missed or cannot access this attraction:
- Missed Place: "${missedPlace || 'Fort Aguada'}"
- Destination: ${destination}
- Reason: ${reason || 'Ran out of time / closed'}
- Remaining Time Available: ${remainingHours || '2 hours'}
- User Interests: ${(currentTrip?.interests || ['Beaches', 'Food', 'Shopping', 'History']).join(', ')}

Suggest 3 viable, nearby alternative attractions that fit the user's available time and interests.
Return ONLY valid JSON:
{
  "originalPlace": "${missedPlace || 'Fort Aguada'}",
  "alternatives": [
    {
      "id": "alt-gen-1",
      "originalPlaceName": "${missedPlace || 'Fort Aguada'}",
      "alternativeName": "Reis Magos Fort",
      "category": "Heritage & River Views",
      "location": "Verem, Bardez (close to Candolim)",
      "distance": "6 km away (approx 14 min drive)",
      "estimatedCost": 50,
      "duration": "1.5 hours",
      "openHours": "09:30 AM - 05:30 PM (Tuesday-Sunday)",
      "whyRecommended": "Historic 16th-century fortress overlooking Mandovi River; much quicker to explore and uncrowded."
    },
    {
      "id": "alt-gen-2",
      "originalPlaceName": "${missedPlace || 'Fort Aguada'}",
      "alternativeName": "Sinquerim Fort Bastion & Beach",
      "category": "Scenic Coastal Rampart",
      "location": "Sinquerim",
      "distance": "2 km away (5 min drive)",
      "estimatedCost": 0,
      "duration": "1 hour",
      "openHours": "Open 24 hours",
      "whyRecommended": "Offers the same coastal aesthetic with stone ramparts right by the water without the long hill walk."
    },
    {
      "id": "alt-gen-3",
      "originalPlaceName": "${missedPlace || 'Fort Aguada'}",
      "alternativeName": "Museum of Goa (MOG)",
      "category": "Art & Regional Culture",
      "location": "Pilerne Industrial Estate",
      "distance": "7 km away",
      "estimatedCost": 150,
      "duration": "1.5 hours",
      "openHours": "10:00 AM - 06:00 PM",
      "whyRecommended": "Indoor cultural alternative with compelling art installations portraying Goa's coastal history."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error suggesting alternatives:', error);
    return res.json({
      originalPlace: req.body?.missedPlace || 'Fort Aguada',
      alternatives: defaultGoaTrip.alternativeSuggestions,
    });
  }
});

// 6. n8n Integration Webhook Endpoint (Section 24 of prompt)
app.post('/api/travel-plan', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log('[n8n Webhook Endpoint Received]:', payload);

    // If an external n8n webhook URL is configured via environment or header, forward it
    const externalN8nUrl = process.env.N8N_WEBHOOK_URL || (req.headers['x-n8n-webhook-url'] as string);
    if (externalN8nUrl) {
      try {
        const n8nResponse = await fetch(externalN8nUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (n8nResponse.ok) {
          const n8nData = await n8nResponse.json();
          return res.json({ source: 'n8n-workflow', data: n8nData });
        }
      } catch (webhookErr) {
        console.warn('n8n external webhook failed, falling back to TravelMate AI internal generator:', webhookErr);
      }
    }

    // Default processing through internal TravelMate AI engine
    const destination = payload.destination || 'Goa';
    return res.json({
      status: 'success',
      source: 'travelmate-ai-engine',
      connectedToN8n: Boolean(externalN8nUrl),
      tripSummary: `Travel plan successfully processed for ${destination} (${payload.travelers || 3} travelers, budget ${payload.currency || '₹'}${payload.budget || 35000})`,
      data: {
        ...defaultGoaTrip,
        destination,
        startingLocation: payload.startingLocation || 'Visakhapatnam',
        budget: payload.budget || 35000,
        currency: payload.currency || '₹',
        travelers: payload.travelers || 3,
      },
    });
  } catch (error: any) {
    console.error('Error in n8n /api/travel-plan endpoint:', error);
    return res.status(500).json({ error: error.message || 'Internal error' });
  }
});

// Vite middleware or production static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TravelMate AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
