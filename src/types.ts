export type UserRole = 'buyer' | 'farmer' | 'logistics' | 'admin';
export type Language = 'kn' | 'en' | 'hi';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  location: string;
  coordinates?: { lat: number; lng: number };
  verification_status: 'verified' | 'pending' | 'unverified';
  created_at: string;
}

export interface FarmerProfile {
  user_id: string;
  farm_or_fpo_name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  produce_categories: string[];
  total_capacity_kg: number;
  locked_quantity_kg: number;
  available_quantity_kg: number;
  reliability_score: number; // 0 to 100
  historical_deliveries: number;
  default_pickup_mode: 'farmgate' | 'hub_drop';
}

export interface BuyerProfile {
  user_id: string;
  business_name: string;
  buyer_type: 'Hotel/Restaurant' | 'Retailer' | 'Processor' | 'Institutional Buyer' | 'Bulk Buyer';
  location: string;
  coordinates: { lat: number; lng: number };
}

export interface LogisticsProvider {
  user_id: string;
  provider_name: string;
  vehicle_type: string;
  vehicle_number: string;
  capacity_kg: number;
  availability: boolean;
  service_area: string;
  current_location: string;
  rating: number;
}

export type DemandStatus = 
  | 'DRAFT'
  | 'OPEN'
  | 'RESPONSE_CLOSED'
  | 'MATCHED'
  | 'CONFIRMED'
  | 'IN_FULFILMENT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'UNFULFILLED'
  | 'CANCELLED';

export interface Demand {
  id: string;
  buyer_id: string;
  buyer_name: string;
  buyer_type: string;
  commodity: string;
  quantity_required: number;
  quality_requirement: 'Grade A' | 'Grade B' | 'Grade C';
  target_price: number; // ₹/kg
  target_price_min?: number; // ₹/kg acceptable minimum
  target_price_max?: number; // ₹/kg acceptable maximum
  quantity_tolerance_pct?: number; // e.g. 5 for ±5% (e.g., 500kg ± 5% = 475kg - 525kg)
  damage_transit_buffer_kg?: number; // e.g., 10-25kg transit/damage buffer
  acceptable_min_quantity?: number; // derived or explicit e.g. 475kg
  acceptable_max_quantity?: number; // derived or explicit e.g. 525kg
  is_negotiable?: boolean;
  delivery_location: string;
  delivery_coordinates: { lat: number; lng: number };
  delivery_deadline: string; // ISO string
  response_deadline: string; // ISO string
  optional_specifications?: string;
  status: DemandStatus;
  created_at: string;
  reopened_count?: number;
  unfulfilled_reason?: string;
}

export type ApplicationStatus = 'APPLIED' | 'SELECTED' | 'NOT_SELECTED' | 'CONFIRMED' | 'REJECTED';

export interface FarmerApplication {
  id: string;
  demand_id: string;
  farmer_id: string;
  farmer_name: string;
  farmer_location: string;
  offered_quantity: number;
  offered_price: number;
  offered_price_min?: number; // farmer price range min
  offered_price_max?: number; // farmer price range max
  quantity_tolerance_pct?: number; // negotiable ±5%
  transit_damage_allowance_kg?: number; // damage/transit buffer e.g. 10kg
  is_price_negotiable?: boolean;
  delivery_capability: 'farmgate_pickup' | 'hub_dropoff';
  optional_note?: string;
  quality_assessment_id?: string;
  quality_assessment?: QualityAssessment;
  status: ApplicationStatus;
  submitted_at: string;
  distance_km: number;
}

export interface ProducePrediction {
  label: string;
  score: number;
}

export interface QualityAssessment {
  id: string;
  application_id?: string;
  farmer_id: string;
  commodity: string;
  recognized_produce?: string;
  is_agricultural_produce?: boolean;
  subject_type?: string;
  rejection_reason?: string;
  produce_category?: 'fruit' | 'vegetable' | 'root_crop' | 'leafy_green' | 'other' | 'non_produce';
  model_source?: string;
  top_predictions?: ProducePrediction[];
  ripeness_stage?: string;
  image_reference: string;
  estimated_grade: 'Grade A' | 'Grade B' | 'Grade C' | 'Rejected (Non-Produce)';
  confidence: number; // 0 to 100
  detected_issues: string[];
  assessment_status: 'PROTOTYPE_ASSESSED' | 'MANUAL_VERIFICATION_REQUIRED' | 'REJECTED_NON_PRODUCE';
  analyzed_at: string;
  details?: {
    color_uniformity: string;
    surface_firmness: string;
    blemishes_percent: number;
    recommended_shelf_life: string;
  };
}

export interface MatchFactorBreakdown {
  quantity_fit: number; // 0 to 1
  price_score: number; // 0 to 1
  quality_score: number; // 0 to 1
  distance_score: number; // 0 to 1
  reliability_score: number; // 0 to 1
  delivery_feasibility: number; // 0 to 1
}

export interface MatchItem {
  application_id: string;
  farmer_id: string;
  farmer_name: string;
  offered_quantity: number;
  selected_quantity: number;
  offered_price: number;
  offered_price_min?: number;
  offered_price_max?: number;
  transit_allowance_kg?: number;
  grade: string;
  confidence: number;
  distance_km: number;
  reliability_score: number;
  delivery_capability: 'farmgate_pickup' | 'hub_dropoff';
  utility_score: number; // 0 to 100
  factor_breakdown: MatchFactorBreakdown;
  status: 'RECOMMENDED' | 'CONFIRMED' | 'NOT_SELECTED';
}

export interface DemandMatchResult {
  demand_id: string;
  total_required: number;
  total_fulfilled: number;
  is_fully_fulfilled: boolean;
  is_within_tolerance?: boolean; // fulfilled within ±5% tolerance
  quantity_tolerance_pct?: number; // ±5%
  damage_transit_buffer_kg?: number; // e.g. 10-25 kg
  acceptable_min_quantity?: number; // e.g. 475 kg
  average_price: number;
  price_range?: { min: number; max: number };
  selected_matches: MatchItem[];
  unselected_matches: MatchItem[];
  estimated_logistics_cost: number;
  route_summary: string;
  calculated_at: string;
}

export interface MatchingWeights {
  quantity_fit: number;
  price: number;
  quality: number;
  distance: number;
  reliability: number;
  delivery_feasibility: number;
  urgency: number;
}

export type OrderStatus = 'CONFIRMED' | 'LOGISTICS_ASSIGNED' | 'PICKUP_IN_PROGRESS' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';

export interface OrderFarmerCommitment {
  farmer_id: string;
  farmer_name: string;
  committed_quantity: number;
  agreed_price: number;
  pickup_location: string;
  coordinates: { lat: number; lng: number };
  quantity_status: 'LOCKED' | 'DELIVERED';
  pickup_mode: 'farmgate_pickup' | 'hub_dropoff';
  is_picked_up: boolean;
}

export interface Order {
  id: string;
  demand_id: string;
  buyer_id: string;
  buyer_name: string;
  commodity: string;
  status: OrderStatus;
  total_quantity: number;
  total_value: number;
  farmers: OrderFarmerCommitment[];
  delivery_location: string;
  delivery_coordinates: { lat: number; lng: number };
  delivery_deadline: string;
  confirmed_at: string;
  logistics_job_id?: string;
  delivered_at?: string;
}

export type LogisticsJobStatus = 
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'EN_ROUTE_PICKUP'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'FALLBACK_SELF_DELIVERY';

export interface RouteStop {
  id: string;
  stop_number: number;
  type: 'pickup' | 'delivery';
  location_name: string;
  coordinates: { lat: number; lng: number };
  farmer_or_buyer_name: string;
  quantity_kg: number;
  commodity: string;
  completed: boolean;
  completed_at?: string;
}

export interface LogisticsJob {
  id: string;
  order_id: string;
  provider_id: string;
  provider_name: string;
  vehicle_type: string;
  vehicle_number: string;
  capacity_kg: number;
  pickup_points: string[];
  delivery_location: string;
  route_stops: RouteStop[];
  total_distance_km: number;
  estimated_duration_hours: number;
  freight_amount: number;
  status: LogisticsJobStatus;
  fallback_mode: boolean;
  notes?: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  order_id: string;
  buyer_id: string;
  farmer_id: string;
  farmer_name: string;
  commodity: string;
  quantity_kg: number;
  amount: number;
  status: 'PENDING_ESCROW' | 'RELEASED_TO_FARMER' | 'REFUNDED';
  created_at: string;
  settled_at?: string;
}

export interface DemandTimer {
  demandId: string;
  totalSeconds: number; // default 1800 (30 minutes)
  remainingSeconds: number;
  isRunning: boolean;
  isExpired: boolean;
  isConfirmed: boolean;
  isRejected: boolean;
  startedAt: string;
}

export type DemandRequirementLevel =
  | 'CRITICAL_HIGH'
  | 'STABLE_REQUIRED'
  | 'MODERATE'
  | 'NOT_AT_PEAK'
  | 'NO_DEMAND_GLUT';

export interface MarketTrendProduct {
  id: string;
  commodity: string;
  variety?: string;
  category: 'Vegetables' | 'Fruit Veg' | 'Greens' | 'Tubers' | 'Spices';
  currentDemandKg: number; // 0 for products with no demand
  tradeMarketSpotPrice: number; // ₹/kg in APMC Mandi
  directContractPrice: number; // ₹/kg on KrishiLink
  peakTimePrice: number; // ₹/kg highest peak time selling price
  sellingPointScore: number; // 0-100 indicating closeness to peak selling point
  isPeakSellingPoint: boolean;
  isRequired: boolean;
  requirementLevel: DemandRequirementLevel;
  demandGrowthPct: number; // e.g. +34.5% or -100%
  primaryMandi: string;
  buyerCount: number;
  marketDescription: string;
  farmerActionAdvisory: string;
}

export interface MLCropSuggestion {
  id: string;
  cropName: string;
  variety: string;
  category: string;
  mlDemandScore: number; // 0-100
  unmetDemandKg: number;
  expectedHarvestWindowDays: number;
  projectedHarvestPriceMin: number;
  projectedHarvestPriceMax: number;
  estimatedCostOfCultivationPerAcre: number;
  projectedNetProfitPerAcre: number;
  profitRoiPct: number;
  demandDriver: string;
  soilSuitability: string[];
  waterRequirement: 'Low' | 'Medium' | 'High';
  riskLevel: 'Very Low' | 'Low' | 'Moderate';
  keyGrowingTips: string;
  buyersWaitingCount: number;
  avoidAlternateCropWarning?: string;
}

