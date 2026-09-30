import { TripPlan } from '../types/travel';

export const defaultGoaTrip: TripPlan = {
  id: 'trip-goa-demo-1',
  destination: 'Goa',
  startingLocation: 'Visakhapatnam',
  departureDate: '2026-10-15',
  returnDate: '2026-10-19',
  durationDays: 5,
  travelers: 3,
  adults: 3,
  children: 0,
  budget: 35000,
  currency: '₹',
  hotelPreference: '4-star',
  foodPreference: 'no-preference',
  transportation: 'flight',
  interests: ['Beaches', 'Food', 'Shopping', 'History'],
  tripStyle: 'friends',
  specialRequirements: 'Near scenic coastlines, seafood tasting, budget conscious 4-star experience.',
  weatherSummary: 'Warm & tropical, sunny afternoons (29°C - 33°C), pleasant sea breezes in the evening.',
  currentTripDay: 2, // Default in progress to show active trip tracking
  createdAt: new Date().toISOString(),

  places: [
    {
      id: 'p1',
      name: 'Fort Aguada & Lighthouse',
      category: 'History & Scenic Views',
      description: 'Well-preserved 17th-century Portuguese fortress and lighthouse offering panoramic vistas of the Arabian Sea.',
      estimatedDuration: '2 hours',
      openTime: '09:30 AM',
      closeTime: '05:30 PM',
      weeklyHoliday: 'None (Open Daily)',
      estimatedEntryFee: 50,
      location: 'Candolim, Sinquerim, North Goa',
      distanceFromPrevious: 'Starting point (Candolim hub)',
      recommendedTime: 'Morning (09:30 AM - 11:30 AM)',
      whyRecommended: 'Iconic heritage landmark with stunning coastal photography opportunities and cool morning breeze.',
      isVerified: true,
      notes: 'Entry fee is estimated per adult. Verify timings on public holidays.'
    },
    {
      id: 'p2',
      name: 'Candolim & Sinquerim Beach',
      category: 'Beaches & Water Sports',
      description: 'Quiet, clean stretch of golden sand ideal for water skiing, parasailing, and relaxed beachside lounging.',
      estimatedDuration: '2.5 hours',
      openTime: '24 Hours',
      closeTime: '24 Hours',
      estimatedEntryFee: 0,
      location: 'North Goa',
      distanceFromPrevious: '2.5 km from Fort Aguada',
      recommendedTime: 'Late Afternoon / Sunset',
      whyRecommended: 'Less crowded than Baga, excellent beach shacks serving fresh coconut water and Goan snacks.',
      isVerified: true
    },
    {
      id: 'p3',
      name: 'Basilica of Bom Jesus',
      category: 'History & UNESCO Heritage',
      description: 'UNESCO World Heritage Site holding the mortal remains of St. Francis Xavier, exemplary Baroque architecture.',
      estimatedDuration: '1.5 hours',
      openTime: '09:00 AM',
      closeTime: '06:30 PM',
      weeklyHoliday: 'Open Daily (Sunday afternoon services)',
      estimatedEntryFee: 0,
      location: 'Old Goa (Velha Goa)',
      distanceFromPrevious: '22 km from Candolim (approx. 45 min drive)',
      recommendedTime: 'Morning (10:00 AM)',
      whyRecommended: 'Rich cultural legacy of Portuguese India, beautiful stone masonry and peaceful ambiance.',
      isVerified: true,
      notes: 'Modest dress code required (shoulders and knees covered).'
    },
    {
      id: 'p4',
      name: 'Fontainhas (Latin Quarter)',
      category: 'Culture & Architecture',
      description: 'Picturesque quarter in Panjim filled with brightly colored Portuguese-style heritage homes, narrow winding alleys, and art cafes.',
      estimatedDuration: '2 hours',
      openTime: 'Open all day (shops 10:00 AM - 08:00 PM)',
      closeTime: '08:00 PM',
      estimatedEntryFee: 0,
      location: 'Panaji (Panjim)',
      distanceFromPrevious: '9 km from Old Goa',
      recommendedTime: 'Late Afternoon (03:30 PM - 05:30 PM)',
      whyRecommended: 'Unrivaled walking photography experience and historic Portuguese bakery stops.',
      isVerified: true
    },
    {
      id: 'p5',
      name: 'Anjuna Flea Market & Beach',
      category: 'Shopping & Coastal Vibe',
      description: 'Famous vibrant market boasting handmade crafts, boho attire, spices, and live music alongside sunset views.',
      estimatedDuration: '3 hours',
      openTime: '09:00 AM (Wednesdays)',
      closeTime: '08:00 PM',
      weeklyHoliday: 'Active primarily on Wednesdays; beach open daily',
      estimatedEntryFee: 0,
      location: 'Anjuna, North Goa',
      distanceFromPrevious: '12 km from Panaji',
      recommendedTime: 'Evening (04:00 PM - 07:30 PM)',
      whyRecommended: 'Top destination for souvenir hunting, handmade jewelery, and seaside ambiance.',
      isVerified: true,
      notes: 'Seasonal vendor attendance varies during monsoon (June to Sept).'
    },
    {
      id: 'p6',
      name: 'Dudhsagar Waterfalls Viewpoint',
      category: 'Nature & Adventure',
      description: 'Four-tiered scenic waterfall located on the Mandovi River, surrounded by lush deciduous forests of Bhagwan Mahaveer Sanctuary.',
      estimatedDuration: '4 hours',
      openTime: '07:00 AM',
      closeTime: '05:00 PM',
      weeklyHoliday: 'Open Daily',
      estimatedEntryFee: 110,
      location: 'Sonaulim, South Goa Border',
      distanceFromPrevious: '65 km from Panaji (requires jeep safari from Kulem)',
      recommendedTime: 'Early Morning (08:00 AM)',
      whyRecommended: 'One of India’s most awe-inspiring waterfalls; magnificent scenery.',
      isVerified: true,
      notes: 'Jeep safari fees (approx ₹500/head shared) payable on site. Forest permits required.'
    }
  ],

  hotels: [
    {
      id: 'h1',
      name: 'Novotel Goa Candolim',
      starRating: 4,
      userRating: 4.4,
      pricePerNight: 3500,
      numberOfNights: 4,
      estimatedTotalStayCost: 14000,
      distanceFromAttractions: '1.2 km to Candolim Beach, 4 km to Fort Aguada',
      facilities: ['Swimming Pool', 'Complimentary Breakfast', 'Free High-Speed Wi-Fi', 'Fitness Center', 'Airport Shuttle Available'],
      location: 'Candolim Main Road, North Goa',
      whyRecommended: 'Strategically located close to beaches, vibrant dining strips, and fits within the ₹14,000 lodging budget.',
      isSelected: true
    },
    {
      id: 'h2',
      name: 'Radisson Goa Candolim',
      starRating: 4,
      userRating: 4.3,
      pricePerNight: 3800,
      numberOfNights: 4,
      estimatedTotalStayCost: 15200,
      distanceFromAttractions: '800 meters from beach strip',
      facilities: ['Poolside Bar', 'Spa & Wellness', 'Free Breakfast', 'Restaurant'],
      location: 'Fort Aguada Road, Candolim',
      whyRecommended: 'Contemporary 4-star comfort with walking proximity to Candolim shacks.',
      isSelected: false
    },
    {
      id: 'h3',
      name: 'Country Inn & Suites by Radisson, Panjim',
      starRating: 4,
      userRating: 4.2,
      pricePerNight: 3100,
      numberOfNights: 4,
      estimatedTotalStayCost: 12400,
      distanceFromAttractions: 'Central Panaji, 1.5 km to Fontainhas',
      facilities: ['Rooftop Pool', 'Multi-cuisine Restaurant', 'Free Wi-Fi', 'City Center Access'],
      location: 'Panjim City Center',
      whyRecommended: 'More budget-friendly 4-star alternative if you prioritize heritage walks and city dining over beachside stay.',
      isSelected: false
    }
  ],

  restaurants: [
    {
      id: 'r1',
      name: 'Fisherman’s Wharf Panjim',
      cuisine: 'Goan Coastal & Seafood',
      localDishes: ['Goan Fish Curry with Rice', 'Prawn Balchão', 'Stuffed Crab', 'Bebinca with Vanilla Ice Cream'],
      hasVegOptions: true,
      hasNonVegOptions: true,
      hasVeganOptions: false,
      priceRange: '₹600 - ₹900 per person',
      estimatedCostPerMeal: 750,
      location: 'Near Old GMC Heritage Complex, Panaji',
      distance: 'Central Panjim',
      whyRecommended: 'Renowned for authentic Goan masala spices and charming colonial ambiance.',
      isSaved: true
    },
    {
      id: 'r2',
      name: 'Vinayak Family Restaurant',
      cuisine: 'Traditional Goan Thali & Seafood',
      localDishes: ['Kingfish Fish Thali', 'Sol Kadhi', 'Squid Rava Fry', 'Goan Veg Thali with Ambot Tik Gravy'],
      hasVegOptions: true,
      hasNonVegOptions: true,
      hasVeganOptions: true,
      priceRange: '₹250 - ₹450 per person',
      estimatedCostPerMeal: 350,
      location: 'Assagao, North Goa',
      distance: '6 km from Candolim',
      whyRecommended: 'Unbeatable value for genuine local Goan fish and vegetarian thalis loved by locals.',
      isSaved: true
    },
    {
      id: 'r3',
      name: 'Viva Panjim',
      cuisine: 'Indo-Portuguese & Goan Home-style',
      localDishes: ['Chicken Xacuti', 'Pork Vindaloo', 'Mushroom Xacuti (Veg)', 'Alle Belle (Goan pancake)'],
      hasVegOptions: true,
      hasNonVegOptions: true,
      hasVeganOptions: false,
      priceRange: '₹400 - ₹600 per person',
      estimatedCostPerMeal: 450,
      location: 'Fontainhas, Panaji',
      distance: 'Inside Latin Quarter alleys',
      whyRecommended: 'Hidden gem in a 150-year-old Portuguese heritage house serving time-honored family recipes.',
      isSaved: false
    }
  ],

  shopping: [
    {
      id: 's1',
      name: 'Panjim Municipal Market & 18th June Road',
      marketType: 'Local Bazaars & Retail Street',
      specialties: ['Goan Feni & Port Wine', 'W240 Roasted & Spiced Cashews', 'Traditional Spices & Kokum', 'Goan Sausages (Chouriço)'],
      priceRange: 'Moderate (Fixed & Bargain stalls)',
      openingHours: '10:00 AM - 08:30 PM',
      location: 'Panaji Center',
      whyRecommended: 'The best authentic spot to buy government-certified cashews, spices, and Goan feni.',
      isSaved: true
    },
    {
      id: 's2',
      name: 'Anjuna & Calangute Beachside Markets',
      marketType: 'Beach Flea Market & Handcrafts',
      specialties: ['Cotton Beachwear & Kaftans', 'Bohemian Silver Jewelery', 'Handmade Leather Bags', 'Decorative Shell Crafts'],
      priceRange: 'Bargaining required',
      openingHours: '11:00 AM - 10:00 PM',
      location: 'Calangute - Baga Road / Anjuna',
      whyRecommended: 'Vibrant seaside shopping with plenty of souvenirs to take back home.',
      isSaved: false
    }
  ],

  guides: [
    {
      id: 'g1',
      serviceName: 'Goa Heritage Action Group (GHAG) Certified Guide',
      location: 'Panaji & Old Goa Heritage Circuit',
      languages: ['English', 'Hindi', 'Konkani', 'Marathi'],
      areasCovered: ['Fontainhas Latin Walk', 'Old Goa Churches', 'Reis Magos Fort'],
      approxCharges: '₹1,200 - ₹1,800 for half-day private group tour (up to 4 persons)',
      experienceYears: '8+ Years',
      bookingSource: 'Official Goa Tourism Development Corporation (GTDC) Counter or accredited agency',
      verificationNote: 'Always verify GTDC Guide Identification Badge before hiring.'
    },
    {
      id: 'g2',
      serviceName: 'North Goa Coastal Explorer Guide',
      location: 'Calangute, Anjuna, Aguada',
      languages: ['English', 'Hindi', 'Telugu'],
      areasCovered: ['Water sports coordination', 'Fort Aguada history', 'Hidden viewpoints'],
      approxCharges: '₹1,000 per group per day',
      experienceYears: '5+ Years',
      bookingSource: 'Local Travel Desk / Hotel Concierge Desk',
      verificationNote: 'Ask for official local tourism license card.'
    }
  ],

  itinerary: [
    {
      dayNumber: 1,
      dateStr: 'Day 1 · Oct 15',
      theme: 'Arrival, Check-in & Candolim Sunset',
      activities: [
        {
          id: 'd1-a1',
          timeSlot: 'Morning',
          time: '10:30 AM',
          title: 'Arrival at Goa Airport / Dabolim & Hotel Transfer',
          activityType: 'transport',
          location: 'Dabolim Airport to Candolim',
          duration: '1 hr 15 min',
          estimatedCost: 1400,
          travelTimeFromPrevious: 'Flight arrival',
          transportationMode: 'Prepaid Taxi',
          notes: 'Book official prepaid taxi counter inside arrival hall to avoid haggling.',
          status: 'completed'
        },
        {
          id: 'd1-a2',
          timeSlot: 'Afternoon',
          time: '12:30 PM',
          title: 'Check-in at Hotel & Refreshment',
          activityType: 'hotel',
          location: 'Novotel Goa Candolim',
          duration: '1.5 hours',
          estimatedCost: 0,
          travelTimeFromPrevious: 'Hotel arrival',
          transportationMode: 'Walking',
          notes: 'Unpack, rest from flight journey, and sip welcome coconut drink.',
          status: 'completed'
        },
        {
          id: 'd1-a3',
          timeSlot: 'Lunch',
          time: '02:00 PM',
          title: 'Authentic Goan Lunch at Calamari Bathe & Binge',
          activityType: 'food',
          location: 'Candolim Beach Road',
          duration: '1 hour',
          estimatedCost: 1500,
          travelTimeFromPrevious: '10 min walk',
          transportationMode: 'Walking',
          notes: 'Enjoy crispy butter garlic prawns and fresh Goan fish curry.',
          status: 'completed'
        },
        {
          id: 'd1-a4',
          timeSlot: 'Evening',
          time: '04:30 PM',
          title: 'Sunset Stroll & Water Sports at Candolim Beach',
          activityType: 'attraction',
          location: 'Candolim Beach',
          duration: '2.5 hours',
          estimatedCost: 600,
          travelTimeFromPrevious: '5 min walk',
          transportationMode: 'Walking',
          notes: 'Option to try banana boat ride or parasailing before dusk.',
          status: 'completed'
        },
        {
          id: 'd1-a5',
          timeSlot: 'Dinner',
          time: '08:30 PM',
          title: 'Seaside Dinner with Acoustic Music',
          activityType: 'food',
          location: 'Fisherman’s Cove Candolim',
          duration: '2 hours',
          estimatedCost: 1800,
          travelTimeFromPrevious: '5 min walk',
          transportationMode: 'Walking',
          notes: 'Relaxing ambient music with Goan and North Indian favorites.',
          status: 'completed'
        }
      ]
    },
    {
      dayNumber: 2,
      dateStr: 'Day 2 · Oct 16 (Today)',
      theme: 'Heritage Forts, Coastal Cliffs & Baga Sunset',
      activities: [
        {
          id: 'd2-a1',
          timeSlot: 'Morning',
          time: '09:00 AM',
          title: 'Fort Aguada & Ancient Portuguese Lighthouse',
          activityType: 'attraction',
          location: 'Sinquerim, Candolim',
          duration: '2 hours',
          estimatedCost: 150,
          travelTimeFromPrevious: '12 min cab from hotel',
          transportationMode: 'Rental Scooter / Cab',
          notes: 'Explore the 1612 fortress, sea ramparts, and moat. Carry water & sunhats.',
          status: 'pending'
        },
        {
          id: 'd2-a2',
          timeSlot: 'Afternoon',
          time: '11:45 AM',
          title: 'Sinquerim Fort & Beach Viewpoint',
          activityType: 'attraction',
          location: 'Sinquerim lower bastion',
          duration: '1 hour',
          estimatedCost: 0,
          travelTimeFromPrevious: '5 min drive',
          transportationMode: 'Scooter / Cab',
          notes: 'Stunning curved sea wall with waves crashing against the fort stones.',
          status: 'pending'
        },
        {
          id: 'd2-a3',
          timeSlot: 'Lunch',
          time: '01:15 PM',
          title: 'Traditional Goan Thali at Vinayak Family Restaurant',
          activityType: 'food',
          location: 'Assagao',
          duration: '1.5 hours',
          estimatedCost: 1050,
          travelTimeFromPrevious: '20 min drive',
          transportationMode: 'Scooter / Cab',
          notes: 'Authentic local fish thali (surmai/kingfish) and vegetarian mushroom thalis.',
          status: 'pending'
        },
        {
          id: 'd2-a4',
          timeSlot: 'Evening',
          time: '03:45 PM',
          title: 'Chapora Fort (Dil Chahta Hai Point) & Sunset',
          activityType: 'attraction',
          location: 'Vagator',
          duration: '2 hours',
          estimatedCost: 0,
          travelTimeFromPrevious: '15 min drive',
          transportationMode: 'Scooter / Cab',
          notes: 'Mild 10-minute red laterite slope hike to the top for magnificent sunset over Vagator Beach.',
          status: 'pending'
        },
        {
          id: 'd2-a5',
          timeSlot: 'Dinner',
          time: '07:30 PM',
          title: 'Baga Beach Boardwalk & Night Markets',
          activityType: 'shopping',
          location: 'Tito’s Lane & Baga Beach shacks',
          duration: '2.5 hours',
          estimatedCost: 1500,
          travelTimeFromPrevious: '15 min drive',
          transportationMode: 'Cab',
          notes: 'Bustling nightlife, souvenir boutiques, and beach shack dessert.',
          status: 'pending'
        }
      ]
    },
    {
      dayNumber: 3,
      dateStr: 'Day 3 · Oct 17',
      theme: 'Old Goa UNESCO Heritage & Fontainhas Latin Walk',
      activities: [
        {
          id: 'd3-a1',
          timeSlot: 'Morning',
          time: '09:30 AM',
          title: 'Basilica of Bom Jesus & Se Cathedral',
          activityType: 'attraction',
          location: 'Old Goa (Velha Goa)',
          duration: '2.5 hours',
          estimatedCost: 100,
          travelTimeFromPrevious: '40 min drive from Candolim',
          transportationMode: 'Cab',
          notes: 'UNESCO World Heritage sites. Observe quietness inside cathedral.',
          status: 'pending'
        },
        {
          id: 'd3-a2',
          timeSlot: 'Lunch',
          time: '01:00 PM',
          title: 'Indo-Portuguese Heritage Lunch at Viva Panjim',
          activityType: 'food',
          location: 'Fontainhas, Panaji',
          duration: '1.5 hours',
          estimatedCost: 1350,
          travelTimeFromPrevious: '18 min drive',
          transportationMode: 'Cab',
          notes: 'Try Chicken Xacuti, Prawn Balchão, and fresh Bebinca.',
          status: 'pending'
        },
        {
          id: 'd3-a3',
          timeSlot: 'Afternoon',
          time: '03:00 PM',
          title: 'Fontainhas Walking Photography Tour',
          activityType: 'attraction',
          location: 'Latin Quarter Panaji',
          duration: '2 hours',
          estimatedCost: 0,
          travelTimeFromPrevious: 'Step right out of lunch spot',
          transportationMode: 'Walking',
          notes: 'Pastel yellow and cobalt blue Portuguese villas, ornate wooden balconies, and artisan tiles.',
          status: 'pending'
        },
        {
          id: 'd3-a4',
          timeSlot: 'Evening',
          time: '05:30 PM',
          title: 'Mandovi River Sunset Cruise',
          activityType: 'attraction',
          location: 'Santa Monica Jetty, Panaji',
          duration: '1.5 hours',
          estimatedCost: 1200,
          travelTimeFromPrevious: '8 min walk to jetty',
          transportationMode: 'Walking',
          notes: 'Includes traditional Goan folk dances (Dekhni & Fugdi) and sunset horizon views.',
          status: 'pending'
        },
        {
          id: 'd3-a5',
          timeSlot: 'Dinner',
          time: '08:00 PM',
          title: 'Riverside Dining at Fisherman’s Wharf',
          activityType: 'food',
          location: 'Panjim Campal Promenade',
          duration: '2 hours',
          estimatedCost: 2000,
          travelTimeFromPrevious: '5 min cab',
          transportationMode: 'Cab',
          notes: 'Stunning river breeze and top-rated fish curry thali.',
          status: 'pending'
        }
      ]
    },
    {
      dayNumber: 4,
      dateStr: 'Day 4 · Oct 18',
      theme: 'Spice Plantation Safari & Panjim Cashew Shopping',
      activities: [
        {
          id: 'd4-a1',
          timeSlot: 'Morning',
          time: '09:00 AM',
          title: 'Sahakari Spice Farm Guided Safari & Buffet',
          activityType: 'attraction',
          location: 'Ponda, South-Central Goa',
          duration: '3 hours',
          estimatedCost: 1500,
          travelTimeFromPrevious: '50 min drive',
          transportationMode: 'Day Cab Rental',
          notes: 'Garland welcome, botanical walk explaining vanilla, cardamom, black pepper, and traditional buffet lunch.',
          status: 'pending'
        },
        {
          id: 'd4-a2',
          timeSlot: 'Lunch',
          time: '01:00 PM',
          title: 'Organic Farm Buffet Lunch (Included in tour)',
          activityType: 'food',
          location: 'Sahakari Farm, Ponda',
          duration: '1 hour',
          estimatedCost: 0,
          travelTimeFromPrevious: 'Inside plantation',
          transportationMode: 'Walking',
          notes: 'Traditional clay-pot cooked vegetables, fish curry, steamed rice, and fresh fruit.',
          status: 'pending'
        },
        {
          id: 'd4-a3',
          timeSlot: 'Afternoon',
          time: '03:30 PM',
          title: 'Cashew, Feni & Souvenir Shopping Spree',
          activityType: 'shopping',
          location: 'Panjim Municipal Market & 18th June Road',
          duration: '2.5 hours',
          estimatedCost: 2000,
          travelTimeFromPrevious: '35 min drive to Panaji',
          transportationMode: 'Day Cab',
          notes: 'Pick up W240 salted/peri-peri cashews, Goan spice boxes, and handicrafts.',
          status: 'pending'
        },
        {
          id: 'd4-a4',
          timeSlot: 'Evening',
          time: '07:30 PM',
          title: 'Dinner at Kokni Kanteen',
          activityType: 'food',
          location: 'Panaji',
          duration: '1.5 hours',
          estimatedCost: 1200,
          travelTimeFromPrevious: '5 min walk',
          transportationMode: 'Walking',
          notes: 'Famous for Tisreo (clams) Sukhem and Sol Kadi.',
          status: 'pending'
        }
      ]
    },
    {
      dayNumber: 5,
      dateStr: 'Day 5 · Oct 19',
      theme: 'Leisure Morning, Packing & Return Journey',
      activities: [
        {
          id: 'd5-a1',
          timeSlot: 'Morning',
          time: '08:30 AM',
          title: 'Morning Beach Walk & Cafe Breakfast',
          activityType: 'leisure',
          location: 'Candolim Beach',
          duration: '1.5 hours',
          estimatedCost: 600,
          travelTimeFromPrevious: '5 min walk',
          transportationMode: 'Walking',
          notes: 'Gentle sunrise stroll along the surf followed by fresh croissants and coffee.',
          status: 'pending'
        },
        {
          id: 'd5-a2',
          timeSlot: 'Morning',
          time: '10:30 AM',
          title: 'Hotel Check-out & Luggage Storage',
          activityType: 'hotel',
          location: 'Novotel Goa Candolim',
          duration: '45 min',
          estimatedCost: 0,
          travelTimeFromPrevious: 'Hotel room',
          transportationMode: 'Walking',
          notes: 'Complete hotel checkout formalities, collect souvenirs.',
          status: 'pending'
        },
        {
          id: 'd5-a3',
          timeSlot: 'Lunch',
          time: '12:00 PM',
          title: 'Farewell Lunch at Bomras',
          activityType: 'food',
          location: 'Anjuna / Candolim boundary',
          duration: '1.5 hours',
          estimatedCost: 1600,
          travelTimeFromPrevious: '10 min cab',
          transportationMode: 'Cab',
          notes: 'Delightful Southeast Asian & coastal fusion cuisine.',
          status: 'pending'
        },
        {
          id: 'd5-a4',
          timeSlot: 'Afternoon',
          time: '02:30 PM',
          title: 'Transfer to Goa Airport for Flight to Visakhapatnam',
          activityType: 'transport',
          location: 'Candolim to Dabolim Airport',
          duration: '1 hr 15 min',
          estimatedCost: 1400,
          travelTimeFromPrevious: 'Pick up luggage from hotel',
          transportationMode: 'Prebooked Airport Cab',
          notes: 'Arrive 2 hours prior to scheduled flight departure.',
          status: 'pending'
        }
      ]
    }
  ],

  budgetBreakdown: {
    hotel: 14000,
    transport: 7000,
    food: 6000,
    activities: 3000,
    shopping: 2000,
    guide: 0,
    miscellaneous: 0,
    emergencyBuffer: 3000,
    totalEstimated: 35000
  },

  expenses: [
    {
      id: 'e1',
      name: 'Airport Prepaid Cab (Dabolim to Candolim)',
      category: 'Transport',
      amount: 1400,
      date: '2026-10-15',
      dayNumber: 1,
      notes: 'Official airport counter rate for 3 passengers with baggage.'
    },
    {
      id: 'e2',
      name: 'Lunch at Calamari Bathe & Binge',
      category: 'Food',
      amount: 1550,
      date: '2026-10-15',
      dayNumber: 1,
      notes: 'Fish curry rice, butter garlic prawns, fresh lime soda.'
    },
    {
      id: 'e3',
      name: 'Candolim Beach Chairs & Shaded Umbrella',
      category: 'Activities',
      amount: 400,
      date: '2026-10-15',
      dayNumber: 1,
      notes: 'Sunset beach lounge for 3 hours.'
    },
    {
      id: 'e4',
      name: 'Dinner at Fisherman’s Cove',
      category: 'Food',
      amount: 1850,
      date: '2026-10-15',
      dayNumber: 1,
      notes: 'Dinner with live music.'
    },
    {
      id: 'e5',
      name: 'Scooter Rental (2 days + Fuel)',
      category: 'Transport',
      amount: 1600,
      date: '2026-10-16',
      dayNumber: 2,
      notes: 'Hired 2 Honda Activas for quick local transit.'
    }
  ],

  savedPlaces: ['p1', 'p3', 'p4'],
  savedHotels: ['h1'],
  savedRestaurants: ['r1', 'r2'],

  alternativeSuggestions: [
    {
      id: 'alt1',
      originalPlaceName: 'Fort Aguada',
      alternativeName: 'Reis Magos Fort',
      category: 'History & River Views',
      location: 'Verem, Bardez (near Candolim)',
      distance: '6.5 km from Candolim (approx. 14 min)',
      estimatedCost: 50,
      duration: '1.5 hours',
      openHours: '09:30 AM - 05:30 PM (Closed Mondays)',
      whyRecommended: 'Much less crowded than Aguada, beautifully restored artillery ramparts overlooking Mandovi River, fits exact morning time slot.'
    },
    {
      id: 'alt2',
      originalPlaceName: 'Candolim Beach',
      alternativeName: 'Museum of Goa (MOG)',
      category: 'Contemporary Art & Culture',
      location: 'Pilerne Industrial Estate (5 km from Candolim)',
      distance: '5 km (12 min)',
      estimatedCost: 150,
      duration: '2 hours',
      openHours: '10:00 AM - 06:00 PM',
      whyRecommended: 'Superb rainy day or non-beach alternative showcasing Goa’s rich history through modern sculptures.'
    },
    {
      id: 'alt3',
      originalPlaceName: 'Baga Beach Nightlife',
      alternativeName: 'Fontainhas Art Cafe Evening Walk',
      category: 'Culture & Cafe Stroll',
      location: 'Panaji',
      distance: '10 km from Candolim',
      estimatedCost: 500,
      duration: '2 hours',
      openHours: 'Open till 09:30 PM',
      whyRecommended: 'Peaceful cultural alternative away from noisy beach clubs, perfect for tea, bakeries, and heritage vibes.'
    }
  ]
};
