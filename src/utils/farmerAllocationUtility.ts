// Algorithmic Multi-Factor Utility Decision Model for Farmer-to-Demand Allocation
// 100% pure TypeScript algorithm - zero heavy external ML dependencies, deployable on Vercel, GitHub, and Cloud Run

import { Demand, FarmerApplication, FarmerProfile, DemandMatchResult, MatchItem, MatchFactorBreakdown } from '../types';

export interface UtilityWeights {
  quality: number;       // e.g. 25%
  distance: number;      // e.g. 20%
  quantity_fit: number;  // e.g. 20%
  reliability: number;   // e.g. 15%
  price: number;         // e.g. 15%
  freshness: number;     // e.g. 5%
}

export const DEFAULT_UTILITY_WEIGHTS: UtilityWeights = {
  quality: 25,
  distance: 20,
  quantity_fit: 20,
  reliability: 15,
  price: 15,
  freshness: 5,
};

export const UTILITY_PRESETS: Record<string, { name: string; description: string; weights: UtilityWeights }> = {
  balanced: {
    name: 'Balanced Multi-Factor',
    description: 'Equitable weighting across Quality, Distance, Lot Fit, Reliability & Cost',
    weights: { quality: 25, distance: 20, quantity_fit: 20, reliability: 15, price: 15, freshness: 5 },
  },
  quality_first: {
    name: 'Grade A Quality Maximizer',
    description: 'Prioritizes optical grade, low blemish rate, and CV confidence',
    weights: { quality: 45, distance: 10, quantity_fit: 15, reliability: 15, price: 10, freshness: 5 },
  },
  eco_proximity: {
    name: 'Lowest Miles & Eco Route',
    description: 'Minimizes transit distance, transit emissions & freight costs',
    weights: { quality: 20, distance: 45, quantity_fit: 15, reliability: 10, price: 5, freshness: 5 },
  },
  cost_efficient: {
    name: 'Price & Volume Minimizer',
    description: 'Focuses strictly on sub-target pricing and bulk batch fulfillment',
    weights: { quality: 15, distance: 10, quantity_fit: 30, reliability: 15, price: 25, freshness: 5 },
  },
};

export interface ScoredFarmerCandidate {
  application: FarmerApplication;
  farmer: FarmerProfile;
  utilityScore: number; // 0 to 100
  factors: {
    quality_score: number;
    distance_score: number;
    quantity_fit: number;
    reliability_score: number;
    price_score: number;
    freshness_score: number;
  };
  keyStrengths: string[];
  riskConsiderations: string[];
  allocatedQuantity: number;
  allocationStatus: 'ALLOCATED' | 'BACKUP_RESERVE' | 'INELIGIBLE';
}

/**
 * Pure Mathematical Utility Function for Farmer Candidate Scoring
 * Evaluates candidates via multi-factor weighted utility:
 * U(f) = (w_q*S_q + w_d*S_d + w_v*S_v + w_r*S_r + w_p*S_p + w_f*S_f) / TotalWeight
 */
export function calculateFarmerUtility(
  demand: Demand,
  application: FarmerApplication,
  farmer: FarmerProfile,
  weights: UtilityWeights = DEFAULT_UTILITY_WEIGHTS
): ScoredFarmerCandidate {
  const totalWeight =
    (weights.quality + weights.distance + weights.quantity_fit + weights.reliability + weights.price + weights.freshness) || 100;

  // 1. QUALITY FACTOR (0 to 100)
  const grade = application.quality_assessment?.estimated_grade || 'Grade A';
  const confidence = (application.quality_assessment?.confidence || 90) / 100;
  const blemishes = application.quality_assessment?.details?.blemishes_percent || 2;
  
  let baseQuality = 80;
  if (grade === 'Grade A') baseQuality = 98;
  else if (grade === 'Grade B') baseQuality = 78;
  else baseQuality = 55;

  const blemishDeduction = Math.min(25, blemishes * 2.5);
  const quality_score = Math.round(
    Math.max(10, Math.min(100, (baseQuality * (0.8 + 0.2 * confidence)) - blemishDeduction))
  );

  // 2. DISTANCE FACTOR (0 to 100) - Exponential Decay
  const distanceKm = Math.max(1, application.distance_km || 20);
  const rawDistanceScore = 100 * Math.exp(-distanceKm / 42);
  const distance_score = Math.round(Math.max(15, Math.min(100, rawDistanceScore + 8)));

  // 3. QUANTITY FIT (0 to 100)
  const offered = application.offered_quantity || 100;
  const ratio = offered / demand.quantity_required;
  let quantity_fit = 70;
  if (ratio >= 0.4 && ratio <= 1.1) {
    quantity_fit = 98; // Ideal single lot or 2-farmer pair
  } else if (ratio > 1.1) {
    quantity_fit = 88; // Ample supply, partial draw needed
  } else if (ratio >= 0.2) {
    quantity_fit = 78; // Modest lot, easily consolidated
  } else {
    quantity_fit = 55; // Highly fragmented micro-lot
  }

  // 4. RELIABILITY FACTOR (0 to 100)
  const baseReliability = farmer.reliability_score || 88;
  const deliveryBonus = Math.min(10, Math.floor((farmer.historical_deliveries || 0) / 3));
  const reliability_score = Math.round(Math.max(30, Math.min(100, baseReliability + deliveryBonus)));

  // 5. PRICE FACTOR (0 to 100)
  const price = application.offered_price || demand.target_price;
  const priceDelta = (demand.target_price - price) / demand.target_price;
  const price_score = Math.round(Math.max(20, Math.min(100, 85 + priceDelta * 140)));

  // 6. FRESHNESS / TIMING FACTOR (0 to 100)
  const freshness_score = application.submitted_at ? 92 : 86;

  // Composite Weighted Sum
  const utilityScore = Math.round(
    ((quality_score * weights.quality) +
     (distance_score * weights.distance) +
     (quantity_fit * weights.quantity_fit) +
     (reliability_score * weights.reliability) +
     (price_score * weights.price) +
     (freshness_score * weights.freshness)) / totalWeight
  );

  // Derive human-readable strengths and considerations
  const keyStrengths: string[] = [];
  const riskConsiderations: string[] = [];

  if (quality_score >= 90) keyStrengths.push('Verified Grade A with low blemish index');
  if (distance_score >= 85) keyStrengths.push(`Hyper-local farmgate proximity (${distanceKm} km)`);
  if (reliability_score >= 92) keyStrengths.push('Top-tier on-time fulfillment track record');
  if (price_score >= 85) keyStrengths.push(`Competitive rate (₹${price}/kg vs target ₹${demand.target_price}/kg)`);
  if (quantity_fit >= 90) keyStrengths.push(`Ideal lot size match (${offered} kg)`);

  if (distanceKm > 45) riskConsiderations.push(`Higher transit distance (${distanceKm} km)`);
  if (price > demand.target_price) riskConsiderations.push(`Asking price ₹${price}/kg exceeds target ₹${demand.target_price}/kg`);
  if (blemishes > 4) riskConsiderations.push(`Blemish rate (${blemishes}%) slightly higher than ideal`);

  return {
    application,
    farmer,
    utilityScore,
    factors: {
      quality_score,
      distance_score,
      quantity_fit,
      reliability_score,
      price_score,
      freshness_score
    },
    keyStrengths,
    riskConsiderations,
    allocatedQuantity: 0,
    allocationStatus: 'BACKUP_RESERVE'
  };
}

/**
 * Algorithmic Multi-Farmer Knapsack Aggregator
 * Solves multi-farmer demand fulfillment maximizing total utility score while minimizing logistics overhead.
 */
export function runUtilityFarmerAllocation(
  demand: Demand,
  applications: FarmerApplication[],
  farmerProfiles: Record<string, FarmerProfile>,
  weights: UtilityWeights = DEFAULT_UTILITY_WEIGHTS
): DemandMatchResult {
  const candidates: ScoredFarmerCandidate[] = [];

  for (const app of applications) {
    const farmer = farmerProfiles[app.farmer_id];
    if (!farmer) continue;
    candidates.push(calculateFarmerUtility(demand, app, farmer, weights));
  }

  // Sort descending by calculated mathematical utility score
  candidates.sort((a, b) => b.utilityScore - a.utilityScore);

  let remainingNeeded = demand.quantity_required;
  const selectedMatches: MatchItem[] = [];
  const unselectedMatches: MatchItem[] = [];

  for (const candidate of candidates) {
    const available = Math.min(candidate.application.offered_quantity, candidate.farmer.available_quantity_kg);
    const breakdown: MatchFactorBreakdown = {
      quality_score: candidate.factors.quality_score / 100,
      distance_score: candidate.factors.distance_score / 100,
      price_score: candidate.factors.price_score / 100,
      reliability_score: candidate.factors.reliability_score / 100,
      quantity_fit: candidate.factors.quantity_fit / 100,
      delivery_feasibility: 0.95
    };

    if (remainingNeeded > 0 && available > 0) {
      const allocateQty = Math.min(remainingNeeded, available);
      remainingNeeded -= allocateQty;
      candidate.allocatedQuantity = allocateQty;
      candidate.allocationStatus = 'ALLOCATED';

      selectedMatches.push({
        application_id: candidate.application.id,
        farmer_id: candidate.farmer.user_id,
        farmer_name: candidate.farmer.farm_or_fpo_name,
        offered_quantity: candidate.application.offered_quantity,
        selected_quantity: allocateQty,
        offered_price: candidate.application.offered_price,
        grade: candidate.application.quality_assessment?.estimated_grade || 'Grade A',
        confidence: candidate.application.quality_assessment?.confidence || 92,
        distance_km: candidate.application.distance_km,
        reliability_score: candidate.farmer.reliability_score || 90,
        delivery_capability: candidate.application.delivery_capability || 'farmgate_pickup',
        utility_score: candidate.utilityScore,
        factor_breakdown: breakdown,
        status: 'RECOMMENDED'
      });
    } else {
      unselectedMatches.push({
        application_id: candidate.application.id,
        farmer_id: candidate.farmer.user_id,
        farmer_name: candidate.farmer.farm_or_fpo_name,
        offered_quantity: candidate.application.offered_quantity,
        selected_quantity: 0,
        offered_price: candidate.application.offered_price,
        grade: candidate.application.quality_assessment?.estimated_grade || 'Grade A',
        confidence: candidate.application.quality_assessment?.confidence || 90,
        distance_km: candidate.application.distance_km,
        reliability_score: candidate.farmer.reliability_score || 85,
        delivery_capability: candidate.application.delivery_capability || 'farmgate_pickup',
        utility_score: candidate.utilityScore,
        factor_breakdown: breakdown,
        status: 'NOT_SELECTED'
      });
    }
  }

  const totalFulfilled = selectedMatches.reduce((s, i) => s + i.selected_quantity, 0);
  const totalCost = selectedMatches.reduce((s, i) => s + (i.selected_quantity * i.offered_price), 0);
  const avgPrice = totalFulfilled > 0 ? totalCost / totalFulfilled : demand.target_price;

  // Logistics route estimate: base flag fall + ₹14/km * max distance + consolidation stop fee
  const maxDistance = selectedMatches.reduce((max, item) => Math.max(max, item.distance_km), 0);
  const logisticsEst = Math.round(350 + (maxDistance * 14) + (selectedMatches.length > 1 ? (selectedMatches.length - 1) * 220 : 0));

  return {
    demand_id: demand.id,
    calculated_at: new Date().toISOString(),
    total_required: demand.quantity_required,
    total_fulfilled: totalFulfilled,
    is_fully_fulfilled: totalFulfilled >= demand.quantity_required,
    selected_matches: selectedMatches,
    unselected_matches: unselectedMatches,
    average_price: Number(avgPrice.toFixed(2)),
    estimated_logistics_cost: logisticsEst,
    route_summary: `${selectedMatches.length} farmer lot aggregation across ${maxDistance} km transport corridor`
  };
}
