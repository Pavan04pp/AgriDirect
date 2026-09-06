import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  FarmerProfile,
  BuyerProfile,
  LogisticsProvider,
  Demand,
  FarmerApplication,
  QualityAssessment,
  Order,
  LogisticsJob,
  Transaction,
  DemandMatchResult,
  MatchingWeights,
  LogisticsJobStatus,
  RouteStop,
  DemandTimer,
  Language
} from '../types';
import { getTranslation, TranslationKey } from '../utils/i18n';
import {
  INITIAL_USERS,
  INITIAL_BUYER_PROFILE,
  INITIAL_FARMER_PROFILES,
  INITIAL_LOGISTICS_PROVIDERS,
  INITIAL_DEMANDS,
  INITIAL_APPLICATIONS,
  INITIAL_QUALITY_ASSESSMENTS,
  INITIAL_ORDERS,
  INITIAL_LOGISTICS_JOBS,
  INITIAL_TRANSACTIONS
} from '../data/seedData';
import { runMatchingEngine, DEFAULT_MATCHING_WEIGHTS } from '../utils/matchingEngine';
import { analyzeProduceQuality } from '../utils/qualityAssessment';

interface AppContextType {
  // Current user / role
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  buyerProfile: BuyerProfile;
  farmerProfiles: Record<string, FarmerProfile>;
  logisticsProviders: Record<string, LogisticsProvider>;
  
  // Demands & Applications
  demands: Demand[];
  applications: FarmerApplication[];
  qualityAssessments: Record<string, QualityAssessment>;
  orders: Order[];
  logisticsJobs: LogisticsJob[];
  transactions: Transaction[];

  // Matching & Weights
  matchingWeights: MatchingWeights;
  updateMatchingWeights: (weights: Partial<MatchingWeights>) => void;
  getDemandMatchResult: (demandId: string) => DemandMatchResult | null;

  // Multilingual support (Kannada default, English, Hindi)
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;

  // Actions
  createDemand: (demandData: Omit<Demand, 'id' | 'created_at' | 'status'>) => Demand;
  closeResponseWindow: (demandId: string) => void;
  confirmMatch: (demandId: string) => { success: boolean; orderId?: string; error?: string };
  rejectMatch: (demandId: string, reason?: string) => void;
  reopenDemand: (demandId: string) => void;
  modifyDemand: (demandId: string, updates: Partial<Demand>) => void;
  cancelDemand: (demandId: string) => void;

  submitFarmerApplication: (
    demandId: string,
    offeredQuantity: number,
    offeredPrice: number,
    deliveryCapability: 'farmgate_pickup' | 'hub_dropoff',
    optionalNote: string,
    qualityAssessment?: QualityAssessment,
    offeredPriceMin?: number,
    offeredPriceMax?: number,
    quantityTolerancePct?: number,
    transitDamageAllowanceKg?: number
  ) => Promise<{ success: boolean; error?: string }>;

  runQualityAssessment: (
    imageRef: string,
    commodity: string,
    farmerId: string
  ) => Promise<QualityAssessment>;

  updateLogisticsJobStatus: (jobId: string, status: LogisticsJobStatus) => void;
  completeLogisticsStop: (jobId: string, stopId: string) => void;
  toggleFallbackLogistics: (jobId: string) => void;

  // 30-Minute Demand Acceptance Timers & Auto-Reject
  demandTimers: Record<string, DemandTimer>;
  getDemandTimer: (demandId: string) => DemandTimer;
  resetDemandTimer: (demandId: string, minutes?: number) => void;
  expireDemandTimerNow: (demandId: string) => void;
  pauseDemandTimer: (demandId: string) => void;
  resumeDemandTimer: (demandId: string) => void;
  autoRejectDemand: (demandId: string, reason?: string) => void;

  // Reset & Demo walkthrough
  resetToDemoSeed: () => void;
  runAutomatedScenarioStep: () => void;
  demoStep: number;
}

const AppContext = createContext<AppContextType | null>(null);

const INITIAL_DEMAND_TIMERS: Record<string, DemandTimer> = {
  'DEMAND-7041': {
    demandId: 'DEMAND-7041',
    totalSeconds: 1800,
    remainingSeconds: 1800,
    isRunning: true,
    isExpired: false,
    isConfirmed: false,
    isRejected: false,
    startedAt: new Date().toISOString(),
  },
  'DEMAND-7032': {
    demandId: 'DEMAND-7032',
    totalSeconds: 1800,
    remainingSeconds: 1800,
    isRunning: true,
    isExpired: false,
    isConfirmed: false,
    isRejected: false,
    startedAt: new Date().toISOString(),
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Start as Buyer
  const [buyerProfile] = useState<BuyerProfile>(INITIAL_BUYER_PROFILE);
  const [farmerProfiles, setFarmerProfiles] = useState<Record<string, FarmerProfile>>(INITIAL_FARMER_PROFILES);
  const [logisticsProviders, setLogisticsProviders] = useState<Record<string, LogisticsProvider>>(INITIAL_LOGISTICS_PROVIDERS);
  
  const [demands, setDemands] = useState<Demand[]>(INITIAL_DEMANDS);
  const [applications, setApplications] = useState<FarmerApplication[]>(INITIAL_APPLICATIONS);
  const [qualityAssessments, setQualityAssessments] = useState<Record<string, QualityAssessment>>(INITIAL_QUALITY_ASSESSMENTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [logisticsJobs, setLogisticsJobs] = useState<LogisticsJob[]>(INITIAL_LOGISTICS_JOBS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  
  const [matchingWeights, setMatchingWeights] = useState<MatchingWeights>(DEFAULT_MATCHING_WEIGHTS);
  const [demoStep, setDemoStep] = useState<number>(0);

  // Multilingual state (Kannada default, English, Hindi)
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('krishi_link_lang');
      if (saved === 'kn' || saved === 'en' || saved === 'hi') return saved;
    } catch {}
    return 'kn'; // Default to Kannada
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('krishi_link_lang', lang);
    } catch {}
  };

  const t = (key: TranslationKey): string => {
    return getTranslation(language, key);
  };

  // 30-Minute Demand Acceptance Timers
  const [demandTimers, setDemandTimers] = useState<Record<string, DemandTimer>>(INITIAL_DEMAND_TIMERS);

  // Auto-reject demand when timer expires (§6, §12)
  const autoRejectDemand = (
    demandId: string,
    reason: string = '30-minute confirmation window expired. Automatically rejected by system (§12).'
  ) => {
    // Uncommitted farmer inventory stays available (§13, §24.8)
    setApplications((prev) =>
      prev.map((app) => (app.demand_id === demandId ? { ...app, status: 'NOT_SELECTED' } : app))
    );

    setDemands((prev) =>
      prev.map((d) =>
        d.id === demandId
          ? {
              ...d,
              status: 'UNFULFILLED',
              unfulfilled_reason: reason,
            }
          : d
      )
    );

    setDemandTimers((prev) => {
      const existing = prev[demandId] || {
        demandId,
        totalSeconds: 1800,
        remainingSeconds: 0,
        isRunning: false,
        isExpired: true,
        isConfirmed: false,
        isRejected: true,
        startedAt: new Date().toISOString(),
      };
      return {
        ...prev,
        [demandId]: {
          ...existing,
          remainingSeconds: 0,
          isRunning: false,
          isExpired: true,
          isRejected: true,
        },
      };
    });
  };

  // 1-second interval ticker for active 30-minute timers
  useEffect(() => {
    const interval = setInterval(() => {
      setDemandTimers((prev) => {
        let changed = false;
        const next: Record<string, DemandTimer> = {};

        (Object.keys(prev) as string[]).forEach((dId) => {
          const timer = prev[dId];
          if (!timer) return;
          if (timer.isRunning && !timer.isExpired && !timer.isConfirmed && !timer.isRejected) {
            if (timer.remainingSeconds > 1) {
              next[dId] = {
                ...timer,
                remainingSeconds: timer.remainingSeconds - 1,
              };
              changed = true;
            } else {
              // 30 minutes expired -> AUTO REJECT!
              next[dId] = {
                ...timer,
                remainingSeconds: 0,
                isRunning: false,
                isExpired: true,
                isRejected: true,
              };
              changed = true;

              // Defer auto-reject state update
              setTimeout(() => {
                autoRejectDemand(
                  dId,
                  '30-minute confirmation window expired. Automatically rejected by system (§12).'
                );
              }, 0);
            }
          } else {
            next[dId] = timer;
          }
        });

        return changed ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getDemandTimer = (demandId: string): DemandTimer => {
    if (demandTimers[demandId]) {
      return demandTimers[demandId];
    }
    return {
      demandId,
      totalSeconds: 1800,
      remainingSeconds: 1800,
      isRunning: true,
      isExpired: false,
      isConfirmed: false,
      isRejected: false,
      startedAt: new Date().toISOString(),
    };
  };

  const resetDemandTimer = (demandId: string, minutes: number = 30) => {
    const total = minutes * 60;
    setDemandTimers((prev) => ({
      ...prev,
      [demandId]: {
        demandId,
        totalSeconds: total,
        remainingSeconds: total,
        isRunning: true,
        isExpired: false,
        isConfirmed: false,
        isRejected: false,
        startedAt: new Date().toISOString(),
      },
    }));
  };

  const expireDemandTimerNow = (demandId: string) => {
    autoRejectDemand(
      demandId,
      '30-minute confirmation window expired. Automatically rejected by system (§12).'
    );
  };

  const pauseDemandTimer = (demandId: string) => {
    setDemandTimers((prev) => {
      const t = prev[demandId];
      if (!t) return prev;
      return {
        ...prev,
        [demandId]: { ...t, isRunning: false },
      };
    });
  };

  const resumeDemandTimer = (demandId: string) => {
    setDemandTimers((prev) => {
      const t = prev[demandId];
      if (!t || t.isExpired || t.isConfirmed || t.isRejected) return prev;
      return {
        ...prev,
        [demandId]: { ...t, isRunning: true },
      };
    });
  };

  // Cached match results
  const getDemandMatchResult = (demandId: string): DemandMatchResult | null => {
    const demand = demands.find((d) => d.id === demandId);
    if (!demand) return null;

    const demandApps = applications.filter((a) => a.demand_id === demandId);
    const farmerMap = new Map<string, FarmerProfile>(Object.entries(farmerProfiles) as [string, FarmerProfile][]);
    return runMatchingEngine(demand, demandApps, farmerMap, matchingWeights);
  };

  const updateMatchingWeights = (newWeights: Partial<MatchingWeights>) => {
    setMatchingWeights((prev) => ({ ...prev, ...newWeights }));
  };

  // Create demand
  const createDemand = (demandData: Omit<Demand, 'id' | 'created_at' | 'status'>): Demand => {
    const tolerancePct = demandData.quantity_tolerance_pct ?? 5;
    const transitBuffer = demandData.damage_transit_buffer_kg ?? Math.round(demandData.quantity_required * (tolerancePct / 100));
    const targetPrice = demandData.target_price;
    const targetMin = demandData.target_price_min ?? Math.round(targetPrice * 0.95);
    const targetMax = demandData.target_price_max ?? Math.round(targetPrice * 1.05);

    const newDemand: Demand = {
      ...demandData,
      id: `DEMAND-${Math.floor(1000 + Math.random() * 9000)}`,
      quantity_tolerance_pct: tolerancePct,
      damage_transit_buffer_kg: transitBuffer,
      acceptable_min_quantity: Math.round(demandData.quantity_required * (1 - tolerancePct / 100)),
      acceptable_max_quantity: Math.round(demandData.quantity_required * (1 + tolerancePct / 100)),
      target_price_min: targetMin,
      target_price_max: targetMax,
      is_negotiable: demandData.is_negotiable ?? true,
      status: 'OPEN',
      created_at: new Date().toISOString(),
    };
    setDemands((prev) => [newDemand, ...prev]);

    // Initialize 30-minute acceptance timer
    setDemandTimers((prev) => ({
      ...prev,
      [newDemand.id]: {
        demandId: newDemand.id,
        totalSeconds: 1800,
        remainingSeconds: 1800,
        isRunning: true,
        isExpired: false,
        isConfirmed: false,
        isRejected: false,
        startedAt: new Date().toISOString(),
      },
    }));

    return newDemand;
  };

  // Close response window and trigger matching cycle
  const closeResponseWindow = (demandId: string) => {
    setDemands((prev) =>
      prev.map((d) => {
        if (d.id === demandId && (d.status === 'OPEN' || d.status === 'DRAFT')) {
          return { ...d, status: 'RESPONSE_CLOSED' };
        }
        return d;
      })
    );
  };

  // Confirm match - Transaction-safe quantity locking (§10, §11, §24.15)
  const confirmMatch = (demandId: string) => {
    const demand = demands.find((d) => d.id === demandId);
    if (!demand) return { success: false, error: 'Demand not found' };

    const matchResult = getDemandMatchResult(demandId);
    if (!matchResult || matchResult.selected_matches.length === 0) {
      return { success: false, error: 'No suitable farmers matched for confirmation' };
    }

    // Check inventory availability (prevent double allocation)
    for (const match of matchResult.selected_matches) {
      const farmer = farmerProfiles[match.farmer_id];
      if (!farmer || farmer.available_quantity_kg < match.selected_quantity) {
        return {
          success: false,
          error: `Farmer ${match.farmer_name} does not have ${match.selected_quantity}kg available. Race condition prevented.`,
        };
      }
    }

    // 1. Lock farmer quantities
    const updatedProfiles = { ...farmerProfiles };
    for (const match of matchResult.selected_matches) {
      const farmer = updatedProfiles[match.farmer_id];
      if (farmer) {
        updatedProfiles[match.farmer_id] = {
          ...farmer,
          locked_quantity_kg: farmer.locked_quantity_kg + match.selected_quantity,
          available_quantity_kg: farmer.available_quantity_kg - match.selected_quantity,
        };
      }
    }
    setFarmerProfiles(updatedProfiles);

    // 2. Update application statuses: selected -> CONFIRMED, unselected -> NOT_SELECTED (§13)
    const selectedAppIds = new Set(matchResult.selected_matches.map((m) => m.application_id));
    setApplications((prev) =>
      prev.map((app) => {
        if (app.demand_id === demandId) {
          if (selectedAppIds.has(app.id)) {
            return { ...app, status: 'CONFIRMED' };
          }
          return { ...app, status: 'NOT_SELECTED' };
        }
        return app;
      })
    );

    // 3. Create Order
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const totalValue = matchResult.selected_matches.reduce(
      (sum, m) => sum + m.selected_quantity * m.offered_price,
      0
    );

    const orderFarmers = matchResult.selected_matches.map((m) => {
      const f = farmerProfiles[m.farmer_id];
      return {
        farmer_id: m.farmer_id,
        farmer_name: m.farmer_name,
        committed_quantity: m.selected_quantity,
        agreed_price: m.offered_price,
        pickup_location: f ? f.location : 'Farm Location',
        coordinates: f ? f.coordinates : { lat: 13.0, lng: 77.5 },
        quantity_status: 'LOCKED' as const,
        pickup_mode: m.delivery_capability,
        is_picked_up: false,
      };
    });

    const newOrder: Order = {
      id: orderId,
      demand_id: demand.id,
      buyer_id: demand.buyer_id,
      buyer_name: demand.buyer_name,
      commodity: demand.commodity,
      status: 'CONFIRMED',
      total_quantity: matchResult.total_fulfilled,
      total_value: totalValue,
      farmers: orderFarmers,
      delivery_location: demand.delivery_location,
      delivery_coordinates: demand.delivery_coordinates,
      delivery_deadline: demand.delivery_deadline,
      confirmed_at: new Date().toISOString(),
    };

    // 4. Create Logistics Job (§14, §15)
    const providersList: LogisticsProvider[] = Object.values(logisticsProviders);
    const activeProvider = providersList.find((p) => p.availability) || providersList[0];

    const stops: RouteStop[] = matchResult.selected_matches.map((m, idx) => {
      const f = farmerProfiles[m.farmer_id];
      return {
        id: `stop-${idx + 1}`,
        stop_number: idx + 1,
        type: 'pickup',
        location_name: f ? f.location : 'Pickup Hub',
        coordinates: f ? f.coordinates : { lat: 13.0, lng: 77.5 },
        farmer_or_buyer_name: m.farmer_name,
        quantity_kg: m.selected_quantity,
        commodity: demand.commodity,
        completed: false,
      };
    });

    // Add final delivery stop
    stops.push({
      id: `stop-${stops.length + 1}`,
      stop_number: stops.length + 1,
      type: 'delivery',
      location_name: demand.delivery_location,
      coordinates: demand.delivery_coordinates,
      farmer_or_buyer_name: demand.buyer_name,
      quantity_kg: matchResult.total_fulfilled,
      commodity: demand.commodity,
      completed: false,
    });

    const jobId = `JOB-${Date.now().toString().slice(-5)}`;
    const newJob: LogisticsJob = {
      id: jobId,
      order_id: orderId,
      provider_id: activeProvider.user_id,
      provider_name: activeProvider.provider_name,
      vehicle_type: activeProvider.vehicle_type,
      vehicle_number: activeProvider.vehicle_number,
      capacity_kg: activeProvider.capacity_kg,
      pickup_points: matchResult.selected_matches.map((m) => m.farmer_name),
      delivery_location: demand.delivery_location,
      route_stops: stops,
      total_distance_km: Math.max(...matchResult.selected_matches.map((m) => m.distance_km)) + stops.length * 10,
      estimated_duration_hours: 3.5,
      freight_amount: matchResult.estimated_logistics_cost,
      status: 'ASSIGNED',
      fallback_mode: false,
      updated_at: new Date().toISOString(),
    };

    newOrder.logistics_job_id = jobId;

    // 5. Create Transactions
    const newTransactions: Transaction[] = matchResult.selected_matches.map((m) => ({
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      order_id: orderId,
      buyer_id: demand.buyer_id,
      farmer_id: m.farmer_id,
      farmer_name: m.farmer_name,
      commodity: demand.commodity,
      quantity_kg: m.selected_quantity,
      amount: m.selected_quantity * m.offered_price,
      status: 'PENDING_ESCROW',
      created_at: new Date().toISOString(),
    }));

    setOrders((prev) => [newOrder, ...prev]);
    setLogisticsJobs((prev) => [newJob, ...prev]);
    setTransactions((prev) => [...newTransactions, ...prev]);

    // Update demand state to CONFIRMED / IN_FULFILMENT
    setDemands((prev) =>
      prev.map((d) => (d.id === demandId ? { ...d, status: 'CONFIRMED' } : d))
    );

    // Stop and mark 30m acceptance timer as confirmed
    setDemandTimers((prev) => {
      const t = prev[demandId];
      if (!t) return prev;
      return {
        ...prev,
        [demandId]: { ...t, isRunning: false, isConfirmed: true },
      };
    });

    return { success: true, orderId };
  };

  // Reject match (§12) -> UNFULFILLED
  const rejectMatch = (demandId: string, reason: string = 'Buyer rejected proposed combination') => {
    // Uncommitted farmer quantities remain available (§13, §24.8)
    setApplications((prev) =>
      prev.map((app) => (app.demand_id === demandId ? { ...app, status: 'NOT_SELECTED' } : app))
    );

    setDemands((prev) =>
      prev.map((d) => (d.id === demandId ? { ...d, status: 'UNFULFILLED', unfulfilled_reason: reason } : d))
    );

    // Mark timer as rejected
    setDemandTimers((prev) => {
      const t = prev[demandId];
      if (!t) return prev;
      return {
        ...prev,
        [demandId]: { ...t, isRunning: false, isRejected: true },
      };
    });
  };

  // Reopen demand (§12)
  const reopenDemand = (demandId: string) => {
    setDemands((prev) =>
      prev.map((d) => {
        if (d.id === demandId) {
          return {
            ...d,
            status: 'OPEN',
            reopened_count: (d.reopened_count || 0) + 1,
            response_deadline: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
            unfulfilled_reason: undefined,
          };
        }
        return d;
      })
    );
    // Reset 30m timer for reopened demand
    resetDemandTimer(demandId, 30);
  };

  // Modify demand requirements (§12)
  const modifyDemand = (demandId: string, updates: Partial<Demand>) => {
    setDemands((prev) =>
      prev.map((d) => {
        if (d.id === demandId) {
          return {
            ...d,
            ...updates,
            status: 'OPEN',
            reopened_count: (d.reopened_count || 0) + 1,
            response_deadline: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
            unfulfilled_reason: undefined,
          };
        }
        return d;
      })
    );
    // Reset 30m timer for modified demand
    resetDemandTimer(demandId, 30);
  };

  // Cancel demand
  const cancelDemand = (demandId: string) => {
    setDemands((prev) =>
      prev.map((d) => (d.id === demandId ? { ...d, status: 'CANCELLED' } : d))
    );
  };

  // Farmer submits application (§5)
  const submitFarmerApplication = async (
    demandId: string,
    offeredQuantity: number,
    offeredPrice: number,
    deliveryCapability: 'farmgate_pickup' | 'hub_dropoff',
    optionalNote: string,
    qualityAssessment?: QualityAssessment,
    offeredPriceMin?: number,
    offeredPriceMax?: number,
    quantityTolerancePct?: number,
    transitDamageAllowanceKg?: number
  ) => {
    const farmer = farmerProfiles[currentUser.id];
    if (!farmer) return { success: false, error: 'Farmer profile not found' };

    if (offeredQuantity > farmer.available_quantity_kg) {
      return {
        success: false,
        error: `Offered quantity (${offeredQuantity}kg) exceeds current available capacity (${farmer.available_quantity_kg}kg)`,
      };
    }

    const minP = offeredPriceMin ?? Math.round(offeredPrice * 0.95);
    const maxP = offeredPriceMax ?? Math.round(offeredPrice * 1.05);
    const tolerancePct = quantityTolerancePct ?? 5;
    const damageBuffer = transitDamageAllowanceKg ?? Math.round(offeredQuantity * (tolerancePct / 100));

    const newApp: FarmerApplication = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      demand_id: demandId,
      farmer_id: currentUser.id,
      farmer_name: currentUser.name,
      farmer_location: currentUser.location,
      offered_quantity: offeredQuantity,
      offered_price: offeredPrice,
      offered_price_min: minP,
      offered_price_max: maxP,
      quantity_tolerance_pct: tolerancePct,
      transit_damage_allowance_kg: damageBuffer,
      is_price_negotiable: true,
      delivery_capability: deliveryCapability,
      optional_note: optionalNote,
      quality_assessment_id: qualityAssessment?.id,
      quality_assessment: qualityAssessment,
      status: 'APPLIED',
      submitted_at: new Date().toISOString(),
      distance_km: 30 + Math.floor(Math.random() * 35),
    };

    setApplications((prev) => [newApp, ...prev]);
    return { success: true };
  };

  // Run Prototype AI Quality Assessment (§7, §22)
  const runQualityAssessment = async (
    imageRef: string,
    commodity: string,
    farmerId: string
  ): Promise<QualityAssessment> => {
    const assessment = await analyzeProduceQuality(imageRef, commodity, farmerId);
    setQualityAssessments((prev) => ({ ...prev, [assessment.id]: assessment }));
    return assessment;
  };

  // Logistics state progression (§14)
  const updateLogisticsJobStatus = (jobId: string, status: LogisticsJobStatus) => {
    setLogisticsJobs((prev) =>
      prev.map((job) => {
        if (job.id === jobId) {
          return { ...job, status, updated_at: new Date().toISOString() };
        }
        return job;
      })
    );

    // Sync order status
    const targetJob = logisticsJobs.find((j) => j.id === jobId);
    if (!targetJob) return;

    if (status === 'PICKED_UP' || status === 'IN_TRANSIT') {
      setOrders((prev) =>
        prev.map((ord) => (ord.id === targetJob.order_id ? { ...ord, status: 'IN_TRANSIT' } : ord))
      );
      setDemands((prev) =>
        prev.map((d) => (d.id === orders.find(o => o.id === targetJob.order_id)?.demand_id ? { ...d, status: 'IN_FULFILMENT' } : d))
      );
    } else if (status === 'DELIVERED') {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === targetJob.order_id
            ? { ...ord, status: 'DELIVERED', delivered_at: new Date().toISOString() }
            : ord
        )
      );

      // Settle transactions & complete locked quantities (§10: LOCKED -> DELIVERED)
      const order = orders.find((o) => o.id === targetJob.order_id);
      if (order) {
        setDemands((prev) =>
          prev.map((d) => (d.id === order.demand_id ? { ...d, status: 'COMPLETED' } : d))
        );

        setTransactions((prev) =>
          prev.map((t) =>
            t.order_id === order.id
              ? { ...t, status: 'RELEASED_TO_FARMER', settled_at: new Date().toISOString() }
              : t
          )
        );

        // Update farmer quantities: locked becomes delivered (deducted from total and locked)
        setFarmerProfiles((prev) => {
          const updated = { ...prev };
          order.farmers.forEach((f) => {
            const profile = updated[f.farmer_id];
            if (profile) {
              updated[f.farmer_id] = {
                ...profile,
                locked_quantity_kg: Math.max(0, profile.locked_quantity_kg - f.committed_quantity),
                total_capacity_kg: Math.max(0, profile.total_capacity_kg - f.committed_quantity),
              };
            }
          });
          return updated;
        });
      }
    }
  };

  const completeLogisticsStop = (jobId: string, stopId: string) => {
    setLogisticsJobs((prev) =>
      prev.map((job) => {
        if (job.id === jobId) {
          const updatedStops = job.route_stops.map((s) =>
            s.id === stopId ? { ...s, completed: true, completed_at: new Date().toISOString() } : s
          );
          const allCompleted = updatedStops.every((s) => s.completed);
          return {
            ...job,
            route_stops: updatedStops,
            status: allCompleted ? 'DELIVERED' : 'IN_TRANSIT',
          };
        }
        return job;
      })
    );
  };

  // Fallback logistics toggle (§24.14)
  const toggleFallbackLogistics = (jobId: string) => {
    setLogisticsJobs((prev) =>
      prev.map((job) => {
        if (job.id === jobId) {
          const newFallback = !job.fallback_mode;
          return {
            ...job,
            fallback_mode: newFallback,
            status: newFallback ? 'FALLBACK_SELF_DELIVERY' : 'ASSIGNED',
            notes: newFallback
              ? 'Fallback initiated: Farmers coordinate local hub drop-off / buyer arranged fleet. Platform transaction proceeds smoothly.'
              : undefined,
          };
        }
        return job;
      })
    );
  };

  // Reset demo seed
  const resetToDemoSeed = () => {
    setDemands(INITIAL_DEMANDS);
    setApplications(INITIAL_APPLICATIONS);
    setFarmerProfiles(INITIAL_FARMER_PROFILES);
    setLogisticsProviders(INITIAL_LOGISTICS_PROVIDERS);
    setQualityAssessments(INITIAL_QUALITY_ASSESSMENTS);
    setOrders(INITIAL_ORDERS);
    setLogisticsJobs(INITIAL_LOGISTICS_JOBS);
    setTransactions(INITIAL_TRANSACTIONS);
    setMatchingWeights(DEFAULT_MATCHING_WEIGHTS);
    setDemandTimers(INITIAL_DEMAND_TIMERS);
    setDemoStep(0);
    setCurrentUser(INITIAL_USERS[0]); // Buyer
  };

  // Step-by-step automated scenario runner for Round-2 demo (§21)
  const runAutomatedScenarioStep = () => {
    if (demoStep === 0) {
      // Step 1: Switch to Buyer, inspect 500kg tomato demand
      setCurrentUser(INITIAL_USERS[0]);
      setDemoStep(1);
    } else if (demoStep === 1) {
      // Step 2: Show farmers' applications received during response window
      setDemoStep(2);
    } else if (demoStep === 2) {
      // Step 3: Close response window & evaluate matching
      closeResponseWindow('DEMAND-7041');
      setDemoStep(3);
    } else if (demoStep === 3) {
      // Step 4: Buyer confirms recommended match (A+B+C = 500kg, locked)
      confirmMatch('DEMAND-7041');
      setDemoStep(4);
    } else if (demoStep === 4) {
      // Step 5: Switch to Farmer to view Quantity Locking
      setCurrentUser(INITIAL_USERS[1]); // Farmer Ramesh
      setDemoStep(5);
    } else if (demoStep === 5) {
      // Step 6: Switch to Logistics to accept job and start pickups
      setCurrentUser(INITIAL_USERS[5]); // Logistics Manjunath
      const job = logisticsJobs[0];
      if (job) {
        updateLogisticsJobStatus(job.id, 'ACCEPTED');
      }
      setDemoStep(6);
    } else if (demoStep === 6) {
      // Step 7: Progress logistics to Picked up and In Transit
      const job = logisticsJobs[0];
      if (job) {
        updateLogisticsJobStatus(job.id, 'IN_TRANSIT');
      }
      setDemoStep(7);
    } else if (demoStep === 7) {
      // Step 8: Complete delivery and settlement
      const job = logisticsJobs[0];
      if (job) {
        updateLogisticsJobStatus(job.id, 'DELIVERED');
      }
      setDemoStep(8);
    } else {
      resetToDemoSeed();
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        buyerProfile,
        farmerProfiles,
        logisticsProviders,
        language,
        setLanguage,
        t,
        demands,
        applications,
        qualityAssessments,
        orders,
        logisticsJobs,
        transactions,
        matchingWeights,
        updateMatchingWeights,
        getDemandMatchResult,
        createDemand,
        closeResponseWindow,
        confirmMatch,
        rejectMatch,
        reopenDemand,
        modifyDemand,
        cancelDemand,
        submitFarmerApplication,
        runQualityAssessment,
        updateLogisticsJobStatus,
        completeLogisticsStop,
        toggleFallbackLogistics,
        demandTimers,
        getDemandTimer,
        resetDemandTimer,
        expireDemandTimerNow,
        pauseDemandTimer,
        resumeDemandTimer,
        autoRejectDemand,
        resetToDemoSeed,
        runAutomatedScenarioStep,
        demoStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
