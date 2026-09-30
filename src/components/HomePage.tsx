import React from 'react';
import { Compass, Sparkles, MapPin, Calendar, Users, DollarSign, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Zap, RefreshCw, Layers, TrendingUp } from 'lucide-react';
import { TripPlan } from '../types/travel';

interface HomePageProps {
  onPlanTripClick: () => void;
  onAskChatClick: () => void;
  onTrackTripClick: () => void;
  onLoadDemoGoa: () => void;
  currentTrip: TripPlan;
}

export const HomePage: React.FC<HomePageProps> = ({
  onPlanTripClick,
  onAskChatClick,
  onTrackTripClick,
  onLoadDemoGoa,
  currentTrip,
}) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-14 lg:p-16 shadow-xl border border-slate-700/50">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-300 bg-teal-950/80 border border-teal-800/60 px-3.5 py-1.5 rounded-full backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Next-Gen Autonomous AI Travel Companion</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Your Personal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400">
              AI Travel Agent
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Plan your destination, stay, activities, food, budget and complete itinerary with one intelligent travel assistant. Geographically clustered routes, realistic cost estimations, and real-time smart replanning.
          </p>

          {/* Action CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={onPlanTripClick}
              className="inline-flex items-center justify-center gap-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-transform active:scale-98 cursor-pointer"
            >
              <span>Plan My Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onAskChatClick}
              className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base backdrop-blur-xs transition-colors cursor-pointer"
            >
              <span>Ask TravelMate</span>
            </button>

            <button
              onClick={onTrackTripClick}
              className="inline-flex items-center justify-center gap-2.5 text-teal-300 hover:text-white px-4 py-3.5 font-semibold text-sm sm:text-base transition-colors"
            >
              <span>Track My Trip</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Active Trip Snapshot Card */}
        <div className="mt-10 pt-8 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-400">Active Destination</span>
            <p className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-400" /> {currentTrip.destination}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400">Duration & Group</span>
            <p className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" /> {currentTrip.durationDays} Days · {currentTrip.travelers} Persons
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400">Total Planned Budget</span>
            <p className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-teal-400" /> {currentTrip.currency}{currentTrip.budget.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400">Current Trip Status</span>
            <p className="text-base sm:text-lg font-bold text-teal-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" /> Day {currentTrip.currentTripDay} in Progress
            </p>
          </div>
        </div>
      </section>

      {/* Featured Demonstration Card (Goa 5-day Scenario) */}
      <section className="bg-white border border-teal-100 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-50 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
              <Zap className="w-4 h-4 text-teal-600" />
              <span>OFFICIAL DEMO WALKTHROUGH READY</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Goa 5-Day Plan: Visakhapatnam to Goa (₹35,000 Budget)
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Instantly test the full demonstration flow requested: 4-star lodging, seafood exploration, Fort Aguada, Candolim, Old Goa churches, Cashew shopping, and live budget optimization from ₹35,000 down to ₹25,000!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onLoadDemoGoa}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-xs"
            >
              <RefreshCw className="w-4 h-4 text-teal-400" />
              <span>Load Full Goa Demo Plan</span>
            </button>
            <button
              onClick={onAskChatClick}
              className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-800 font-semibold text-sm px-3 py-2"
            >
              <span>Test Chatbot Actions</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How TravelMate AI Transforms Your Journey
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Engineered with deep spatial reasoning, dynamic constraints, and transparent verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 hover:border-teal-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Geographic Routing & Timelines</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              No zigzagging across towns. Activities are grouped geographically by day with transit times, opening hours, and rest buffers factored in.
            </p>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-2">
              <span>Optimized clusters</span>
              <span>·</span>
              <span>Accurate transit times</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 hover:border-teal-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Budget AI & "What-If" Simulator</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Simulate shifting your budget from ₹35,000 to ₹25,000 or adding 2 extra travelers. AI calculates exact impact and suggests itemized savings.
            </p>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-2">
              <span>Itemized reductions</span>
              <span>·</span>
              <span>What-If simulator</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 hover:border-teal-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Live Replanning & Backup Places</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Missed a place like Fort Aguada? Say the word and TravelMate suggests nearby alternatives like Reis Magos Fort and updates your itinerary.
            </p>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-2">
              <span>Automatic backups</span>
              <span>·</span>
              <span>Zero hallucinated prices</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Note */}
      <section className="bg-slate-100 border border-slate-200 rounded-2xl p-6 sm:p-8 text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Verified & Estimated Data Distinction
          </h4>
          <p className="text-xs sm:text-sm text-slate-600">
            TravelMate AI transparently identifies estimated costs vs. officially verified hours. We do not invent real-time hotel availability or fake phone numbers.
          </p>
        </div>
        <button
          onClick={onPlanTripClick}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0"
        >
          Start Custom Plan
        </button>
      </section>
    </div>
  );
};
