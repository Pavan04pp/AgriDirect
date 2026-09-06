import {
  Demand,
  FarmerApplication,
  FarmerProfile,
  MatchingWeights,
  DemandMatchResult,
  MatchItem,
  MatchFactorBreakdown
} from '../types';

export const DEFAULT_MATCHING_WEIGHTS: MatchingWeights = {
  quantity_fit: 25,
  price: 20,
  quality: 20,
  distance: 15,
  reliability: 10,
  delivery_feasibility: 10,
  urgency: 0,
};

/**
 * Deterministic utility-based matching function.
 * Evaluates valid applications using configurable weights and aggregates
 * multiple farmers to fulfill the buyer demand.
 */
export function runMatchingEngine(
  demand: Demand,
  applications: FarmerApplication[],
  farmers: Map<string, FarmerProfile>,
  weights: MatchingWeights = DEFAULT_MATCHING_WEIGHTS
): DemandMatchResult {
  // Normalize weight sum
  const weightTotal = 
    weights.quantity_fit + 
    weights.price + 
    weights.quality + 
    weights.distance + 
    weights.reliability + 
    weights.delivery_feasibility + 
    (weights.urgency || 0);

  const w = {
    quantity: weights.quantity_fit / (weightTotal || 1),
    price: weights.price / (weightTotal || 1),
    quality: weights.quality / (weightTotal || 1),
    distance: weights.distance / (weightTotal || 1),
    reliability: weights.reliability / (weightTotal || 1),
    feasibility: weights.delivery_feasibility / (weightTotal || 1),
  };

  // 1. Filter incompatible applications:
  // - Must have offered quantity > 0
  // - Farmer must have available quantity > 0
  // - Quality must meet or exceed requirement (Grade A requires Grade A, Grade B accepts Grade A or B)
  const gradeRank = { 'Grade A': 3, 'Grade B': 2, 'Grade C': 1 };
  const minRequiredRank = gradeRank[demand.quality_requirement] || 1;

  const validApps = applications.filter((app) => {
    const farmer = farmers.get(app.farmer_id);
    if (!farmer) return false;
    if (farmer.available_quantity_kg <= 0) return false;
    if (app.offered_quantity <= 0) return false;

    // Check grade
    const appGrade = app.quality_assessment?.estimated_grade || 'Grade B';
    const appGradeRank = gradeRank[appGrade] || 1;
    if (appGradeRank < minRequiredRank) return false;

    return true;
  });

  // Calculate scores for each valid candidate
  const tolerancePct = demand.quantity_tolerance_pct ?? 5;
  const transitDamageBufferKg = demand.damage_transit_buffer_kg ?? Math.round(demand.quantity_required * (tolerancePct / 100));
  const minAcceptableQty = demand.acceptable_min_quantity ?? Math.round(demand.quantity_required * (1 - tolerancePct / 100));

  const buyerTargetPrice = demand.target_price;
  const buyerMinPrice = demand.target_price_min ?? Math.round(buyerTargetPrice * 0.95);
  const buyerMaxPrice = demand.target_price_max ?? Math.round(buyerTargetPrice * 1.05);

  const allOfferedPrices = validApps.map((a) => a.offered_price_min ?? a.offered_price);
  const minPrice = Math.min(...allOfferedPrices, buyerMinPrice);
  const maxPrice = Math.max(...validApps.map((a) => a.offered_price_max ?? a.offered_price), buyerMaxPrice);

  const scoredCandidates: {
    app: FarmerApplication;
    farmer: FarmerProfile;
    factors: MatchFactorBreakdown;
    utilityScore: number;
  }[] = validApps.map((app) => {
    const farmer = farmers.get(app.farmer_id)!;

    // Quantity fit: ratio of offered to required, considering ±5% tolerance
    const effectiveOffered = app.offered_quantity + (app.transit_damage_allowance_kg ?? 0);
    const qRatio = Math.min(effectiveOffered / demand.quantity_required, 1.0);
    const quantity_fit = Math.min(1.0, qRatio >= 0.2 ? 0.7 + 0.3 * qRatio : qRatio * 2);

    // Price score with range negotiation:
    // Farmer price range [farmerMin, farmerMax] vs Buyer range [buyerMin, buyerMax]
    const fMin = app.offered_price_min ?? app.offered_price;
    const fMax = app.offered_price_max ?? app.offered_price;
    const fMid = (fMin + fMax) / 2;

    // A lower mid price relative to max price gives higher score, with bonus if within buyer's range
    let price_score = maxPrice === minPrice 
      ? 1.0 
      : Math.max(0, Math.min(1, 1 - (fMid - minPrice) / (maxPrice - minPrice)));

    if (fMin <= buyerTargetPrice && fMax <= buyerMaxPrice) {
      price_score = Math.min(1.0, price_score * 1.08); // Bonus for matching within negotiable range
    }

    // Quality score: Grade A with high confidence gets 1.0
    const appGrade = app.quality_assessment?.estimated_grade || 'Grade B';
    const confidence = (app.quality_assessment?.confidence || 80) / 100;
    const baseGradeScore = appGrade === 'Grade A' ? 1.0 : appGrade === 'Grade B' ? 0.75 : 0.5;
    const quality_score = baseGradeScore * (0.8 + 0.2 * confidence);

    // Distance score: within 30km is 1.0, drops to 0 at 100km
    const distance_score = Math.max(0, Math.min(1, 1 - (app.distance_km - 15) / 85));

    // Reliability score from profile (0 to 100 -> 0 to 1)
    const reliability_score = Math.min(1, farmer.reliability_score / 100);

    // Delivery feasibility score: hub drop-off = 1.0, farmgate = 0.85
    const delivery_feasibility = app.delivery_capability === 'hub_dropoff' ? 1.0 : 0.88;

    const factors: MatchFactorBreakdown = {
      quantity_fit,
      price_score,
      quality_score,
      distance_score,
      reliability_score,
      delivery_feasibility,
    };

    const utilityScore = Math.round(
      (factors.quantity_fit * w.quantity +
        factors.price_score * w.price +
        factors.quality_score * w.quality +
        factors.distance_score * w.distance +
        factors.reliability_score * w.reliability +
        factors.delivery_feasibility * w.feasibility) * 100
    );

    return {
      app,
      farmer,
      factors,
      utilityScore,
    };
  });

  // Sort descending by utility score
  scoredCandidates.sort((a, b) => b.utilityScore - a.utilityScore);

  // Multi-Farmer Aggregation:
  // We need to fulfill demand.quantity_required (or within ±5% tolerance).
  let remainingNeeded = demand.quantity_required;
  const selectedMatches: MatchItem[] = [];
  const unselectedMatches: MatchItem[] = [];

  for (const candidate of scoredCandidates) {
    const maxAllocatable = Math.min(
      candidate.app.offered_quantity,
      candidate.farmer.available_quantity_kg
    );

    if (remainingNeeded > 0 && maxAllocatable > 0) {
      const allocated = Math.min(remainingNeeded, maxAllocatable);
      remainingNeeded -= allocated;

      selectedMatches.push({
        application_id: candidate.app.id,
        farmer_id: candidate.app.farmer_id,
        farmer_name: candidate.app.farmer_name,
        offered_quantity: candidate.app.offered_quantity,
        selected_quantity: allocated,
        offered_price: candidate.app.offered_price,
        offered_price_min: candidate.app.offered_price_min,
        offered_price_max: candidate.app.offered_price_max,
        transit_allowance_kg: candidate.app.transit_damage_allowance_kg,
        grade: candidate.app.quality_assessment?.estimated_grade || 'Grade A',
        confidence: candidate.app.quality_assessment?.confidence || 90,
        distance_km: candidate.app.distance_km,
        reliability_score: candidate.farmer.reliability_score,
        delivery_capability: candidate.app.delivery_capability,
        utility_score: candidate.utilityScore,
        factor_breakdown: candidate.factors,
        status: 'RECOMMENDED',
      });
    } else {
      unselectedMatches.push({
        application_id: candidate.app.id,
        farmer_id: candidate.app.farmer_id,
        farmer_name: candidate.app.farmer_name,
        offered_quantity: candidate.app.offered_quantity,
        selected_quantity: 0,
        offered_price: candidate.app.offered_price,
        offered_price_min: candidate.app.offered_price_min,
        offered_price_max: candidate.app.offered_price_max,
        transit_allowance_kg: candidate.app.transit_damage_allowance_kg,
        grade: candidate.app.quality_assessment?.estimated_grade || 'Grade A',
        confidence: candidate.app.quality_assessment?.confidence || 85,
        distance_km: candidate.app.distance_km,
        reliability_score: candidate.farmer.reliability_score,
        delivery_capability: candidate.app.delivery_capability,
        utility_score: candidate.utilityScore,
        factor_breakdown: candidate.factors,
        status: 'NOT_SELECTED',
      });
    }
  }

  const totalFulfilled = selectedMatches.reduce((sum, item) => sum + item.selected_quantity, 0);
  const totalCost = selectedMatches.reduce(
    (sum, item) => sum + item.selected_quantity * item.offered_price,
    0
  );
  const averagePrice = totalFulfilled > 0 ? Math.round((totalCost / totalFulfilled) * 10) / 10 : 0;

  const minAgreedPrice = selectedMatches.length > 0
    ? Math.min(...selectedMatches.map((m) => m.offered_price_min ?? m.offered_price))
    : averagePrice;
  const maxAgreedPrice = selectedMatches.length > 0
    ? Math.max(...selectedMatches.map((m) => m.offered_price_max ?? m.offered_price))
    : averagePrice;

  // Logistics estimation: base ₹500 + ₹14/km per stop + ₹1.5/kg transport
  const totalDistance = selectedMatches.length > 0 
    ? Math.max(...selectedMatches.map((m) => m.distance_km)) + (selectedMatches.length - 1) * 12 
    : 0;
  const estimatedLogisticsCost = selectedMatches.length > 0
    ? Math.round(500 + totalDistance * 16 + totalFulfilled * 1.2)
    : 0;

  const routeSummary = selectedMatches.length > 0
    ? `${selectedMatches.map((m) => m.farmer_name).join(' → ')} → ${demand.delivery_location}`
    : 'No feasible route';

  const isFullyFulfilled = totalFulfilled >= demand.quantity_required;
  const isWithinTolerance = totalFulfilled >= minAcceptableQty;

  return {
    demand_id: demand.id,
    total_required: demand.quantity_required,
    total_fulfilled: totalFulfilled,
    is_fully_fulfilled: isFullyFulfilled,
    is_within_tolerance: isWithinTolerance,
    quantity_tolerance_pct: tolerancePct,
    damage_transit_buffer_kg: transitDamageBufferKg,
    acceptable_min_quantity: minAcceptableQty,
    average_price: averagePrice,
    price_range: { min: minAgreedPrice, max: maxAgreedPrice },
    selected_matches: selectedMatches,
    unselected_matches: unselectedMatches,
    estimated_logistics_cost: estimatedLogisticsCost,
    route_summary: routeSummary,
    calculated_at: new Date().toISOString(),
  };
}
