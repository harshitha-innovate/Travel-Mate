import React, { useState } from 'react';
import { TripPlan } from '../types/travel';
import { Workflow, Send, CheckCircle2, ArrowRight, Code2, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import { sendToN8nWebhook } from '../services/api';

interface N8nIntegrationHubProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrip: TripPlan;
}

export const N8nIntegrationHub: React.FC<N8nIntegrationHubProps> = ({
  isOpen,
  onClose,
  currentTrip,
}) => {
  const [webhookUrl, setWebhookUrl] = useState(
    localStorage.getItem('travelmate_n8n_webhook_url') || ''
  );
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [responsePayload, setResponsePayload] = useState<any>(null);

  if (!isOpen) return null;

  const samplePayload = {
    destination: currentTrip.destination,
    startingLocation: currentTrip.startingLocation,
    departureDate: currentTrip.departureDate,
    returnDate: currentTrip.returnDate,
    travelers: currentTrip.travelers,
    adults: currentTrip.adults,
    children: currentTrip.children,
    budget: currentTrip.budget,
    currency: currentTrip.currency,
    hotelPreference: currentTrip.hotelPreference,
    foodPreference: currentTrip.foodPreference,
    transportation: currentTrip.transportation,
    interests: currentTrip.interests,
    tripStyle: currentTrip.tripStyle,
    specialRequirements: currentTrip.specialRequirements,
  };

  const handleSaveWebhook = () => {
    localStorage.setItem('travelmate_n8n_webhook_url', webhookUrl.trim());
    alert('n8n Webhook URL saved to local session!');
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(samplePayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestWebhookDispatch = async () => {
    setIsTesting(true);
    try {
      const result = await sendToN8nWebhook(samplePayload, webhookUrl.trim() || undefined);
      setResponsePayload(result);
    } catch (e: any) {
      setResponsePayload({ error: e.message || 'Dispatch error' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                n8n Webhook & External API Service Layer
              </h2>
              <p className="text-xs text-slate-500">
                Modular pipeline architecture connecting TravelMate AI to automated n8n workflows.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm p-1"
          >
            ✕
          </button>
        </div>

        {/* Architecture Overview */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
          <span className="font-bold text-slate-900 block text-xs">
            How n8n Integrates with TravelMate AI:
          </span>
          <p className="leading-relaxed">
            The endpoint <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-900">POST /api/travel-plan</code> receives standardized trip payloads. In production, this proxies seamlessly to your n8n workflow webhook, enabling automated multi-agent subtasks:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-medium text-[11px] text-slate-700">
            <span className="bg-white p-1.5 rounded border border-slate-200 text-center">1. Flight / Hotel Search</span>
            <span className="bg-white p-1.5 rounded border border-slate-200 text-center">2. Weather & Maps Matrix</span>
            <span className="bg-white p-1.5 rounded border border-slate-200 text-center">3. Local Attractions Research</span>
            <span className="bg-white p-1.5 rounded border border-slate-200 text-center">4. JSON Itinerary Synthesis</span>
          </div>
        </div>

        {/* Webhook Configuration Field */}
        <div className="space-y-2 text-xs">
          <label className="block font-semibold text-slate-700">
            Target n8n Webhook URL (Optional):
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/webhook/travel-plan"
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-teal-500"
            />
            <button
              onClick={handleSaveWebhook}
              className="px-3.5 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
            >
              Save URL
            </button>
          </div>
          <span className="text-[11px] text-slate-400">
            If left empty, the built-in TravelMate AI backend engine fulfills the request immediately.
          </span>
        </div>

        {/* Payload Sample */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-teal-600" />
              Standardized Outgoing JSON Contract (POST /api/travel-plan):
            </span>
            <button
              onClick={handleCopyPayload}
              className="inline-flex items-center gap-1 text-[11px] text-teal-700 hover:text-teal-900 font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Payload'}</span>
            </button>
          </div>

          <pre className="bg-slate-900 text-teal-300 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto max-h-44">
            {JSON.stringify(samplePayload, null, 2)}
          </pre>
        </div>

        {/* Test Trigger Button & Output */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <button
              onClick={handleTestWebhookDispatch}
              disabled={isTesting}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching to /api/travel-plan...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Test Dispatch to /api/travel-plan</span>
                </>
              )}
            </button>
            <span className="text-xs text-slate-400">
              Simulates client-to-n8n roundtrip
            </span>
          </div>

          {responsePayload && (
            <div className="bg-slate-900 text-emerald-300 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-44 space-y-1">
              <span className="text-slate-400 block text-[10px]">
                Response received from {responsePayload.source || 'server'}:
              </span>
              <pre>{JSON.stringify(responsePayload, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
