import { TripFormData, TripPlan, WhatIfSimulation, BudgetOptimizationSuggestion } from '../types/travel';

export async function generateTravelPlan(formData: TripFormData): Promise<TripPlan> {
  const response = await fetch('/api/gemini/generate-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    throw new Error(`Failed to generate travel plan: ${response.statusText}`);
  }
  return response.json();
}

export async function sendChatMessage(messages: any[], currentTrip: TripPlan, userQuestion: string) {
  const response = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, currentTrip, userQuestion }),
  });
  if (!response.ok) {
    throw new Error(`Chat error: ${response.statusText}`);
  }
  return response.json();
}

export async function optimizeBudgetAI(currentTrip: TripPlan): Promise<{
  totalPotentialSavings: number;
  newEstimatedCost: number;
  suggestions: BudgetOptimizationSuggestion[];
  revisedBreakdown: any;
}> {
  const response = await fetch('/api/gemini/optimize-budget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentTrip }),
  });
  if (!response.ok) {
    throw new Error(`Optimization error: ${response.statusText}`);
  }
  return response.json();
}

export async function simulateWhatIfAI(currentTrip: TripPlan, simulationParams: any): Promise<WhatIfSimulation & { revisedBreakdown?: any }> {
  const response = await fetch('/api/gemini/simulate-what-if', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentTrip, simulationParams }),
  });
  if (!response.ok) {
    throw new Error(`Simulation error: ${response.statusText}`);
  }
  return response.json();
}

export async function suggestAlternativesAI(
  currentTrip: TripPlan,
  missedPlace: string,
  reason: string,
  remainingHours: string
) {
  const response = await fetch('/api/gemini/suggest-alternatives', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentTrip, missedPlace, reason, remainingHours }),
  });
  if (!response.ok) {
    throw new Error(`Alternatives error: ${response.statusText}`);
  }
  return response.json();
}

export async function sendToN8nWebhook(payload: any, webhookUrl?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (webhookUrl) {
    headers['x-n8n-webhook-url'] = webhookUrl;
  }
  const response = await fetch('/api/travel-plan', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Webhook dispatch error: ${response.statusText}`);
  }
  return response.json();
}
