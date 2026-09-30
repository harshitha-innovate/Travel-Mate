import React, { useState } from 'react';
import { Compass, Calendar, DollarSign, Receipt, MapPin, MessageSquare, Bot, Menu, X, ArrowRight, Share2, Workflow } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  destinationName?: string;
  onOpenChat: () => void;
  onOpenN8nModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  destinationName = 'Goa',
  onOpenChat,
  onOpenN8nModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'plan', label: 'Plan Trip' },
    { id: 'dashboard', label: 'My Trip' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'explore', label: 'Explore' },
    { id: 'budget', label: 'Budget & What-If' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'tracker', label: 'Trip Tracker' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left focus-visible:outline-teal-600 rounded-lg group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm group-hover:bg-teal-700 transition-colors">
                <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                  TravelMate<span className="text-teal-600">AI</span>
                </span>
                <p className="text-[11px] font-medium text-slate-500 tracking-wide">
                  Plan Smarter. Travel Better.
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-teal-700 bg-teal-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onOpenN8nModal}
              title="View n8n Webhook Architecture & API Hub"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <Workflow className="w-4 h-4 text-emerald-600" />
            </button>

            <button
              onClick={onOpenChat}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold shadow-xs transition-all hover:shadow-md cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Ask TravelMate</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenChat}
              className="p-2 text-teal-600 bg-teal-50 rounded-lg"
              title="Ask AI"
            >
              <Bot className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus-visible:outline-teal-600"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-5 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === item.id
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenN8nModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-emerald-600" /> n8n Webhook & API Hub
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => {
                onOpenChat();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-teal-600 text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" /> Ask TravelMate Chatbot
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
