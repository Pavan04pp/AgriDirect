import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { analyzeProduceProduceVision, getVisionModelStatus } from './src/server/produceVisionService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// In-Memory Database Store (ready for backend operations & video presentation)
interface UserRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'buyer' | 'farmer' | 'logistics' | 'admin';
  location: string;
  verification_status: 'verified' | 'pending' | 'unverified';
  created_at: string;
  organization?: string;
  avatar_url?: string;
}

let users: UserRecord[] = [
  {
    id: 'user_buyer_1',
    name: 'Chef Arvind (GreenLeaf Kitchens)',
    phone: '+91 98450 12345',
    email: 'arvind@greenleafkitchens.com',
    role: 'buyer',
    location: 'Indiranagar, Bengaluru',
    verification_status: 'verified',
    created_at: '2026-01-10T10:00:00Z',
    organization: 'GreenLeaf Commercial Kitchens',
    avatar_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&auto=format&fit=crop&q=60',
  },
  {
    id: 'user_farmer_1',
    name: 'Ramesh Gowda',
    phone: '+91 94480 54321',
    email: 'ramesh.gowda@hosakote-fpo.org',
    role: 'farmer',
    location: 'Hosakote, Bengaluru Rural',
    verification_status: 'verified',
    created_at: '2026-01-12T08:30:00Z',
    organization: 'Hosakote Horticulture Collective',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
  },
  {
    id: 'user_logistics_1',
    name: 'Kisan Express Freight',
    phone: '+91 99000 88776',
    email: 'dispatch@kisanexpress.in',
    role: 'logistics',
    location: 'Kolar-Bengaluru Freight Corridor',
    verification_status: 'verified',
    created_at: '2026-01-05T09:00:00Z',
    organization: 'Kisan Express Rural Logistics Ltd.',
    avatar_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=60',
  },
  {
    id: 'user_admin_1',
    name: 'Platform Operations Admin',
    phone: '+91 80 2345 6789',
    email: 'admin@krishilink.internal',
    role: 'admin',
    location: 'Bengaluru Command Center',
    verification_status: 'verified',
    created_at: '2026-01-01T00:00:00Z',
    organization: 'KrishiLink Agritech Network',
  },
];

let demands = [
  {
    id: 'DEM-2026-001',
    buyer_id: 'user_buyer_1',
    buyer_name: 'Chef Arvind (GreenLeaf Kitchens)',
    buyer_type: 'Hotel/Restaurant',
    commodity: 'Tomatoes (Hybrid / Sahu)',
    quantity_required: 500,
    quality_requirement: 'Grade A',
    target_price: 24,
    target_price_min: 22,
    target_price_max: 26,
    quantity_tolerance_pct: 5,
    damage_transit_buffer_kg: 25,
    acceptable_min_quantity: 475,
    acceptable_max_quantity: 525,
    is_negotiable: true,
    delivery_location: 'GreenLeaf Kitchens, 100ft Rd, Indiranagar, Bengaluru',
    delivery_deadline: new Date(Date.now() + 86400000).toISOString(),
    response_deadline: new Date(Date.now() + 3600000).toISOString(),
    status: 'RESPONSE_CLOSED',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'DEM-2026-002',
    buyer_id: 'user_buyer_1',
    buyer_name: 'Subramanya Provision Hub',
    buyer_type: 'Retailer',
    commodity: 'Red Onions (Nashik/Chitradurga)',
    quantity_required: 1200,
    quality_requirement: 'Grade A',
    target_price: 32,
    target_price_min: 30,
    target_price_max: 35,
    quantity_tolerance_pct: 5,
    damage_transit_buffer_kg: 60,
    acceptable_min_quantity: 1140,
    acceptable_max_quantity: 1260,
    is_negotiable: true,
    delivery_location: 'Yeshwanthpur APMC Yard Gate 3, Bengaluru',
    delivery_deadline: new Date(Date.now() + 172800000).toISOString(),
    response_deadline: new Date(Date.now() + 14400000).toISOString(),
    status: 'OPEN',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'DEM-2026-003',
    buyer_id: 'user_buyer_1',
    buyer_name: 'FreshHarvest Foods Ltd',
    buyer_type: 'Processor',
    commodity: 'Processing Potatoes (Kufri Chipsona)',
    quantity_required: 2000,
    quality_requirement: 'Grade B',
    target_price: 19,
    target_price_min: 18,
    target_price_max: 21,
    quantity_tolerance_pct: 7,
    damage_transit_buffer_kg: 100,
    acceptable_min_quantity: 1860,
    acceptable_max_quantity: 2140,
    is_negotiable: true,
    delivery_location: 'Peenya Industrial Area Phase 2, Bengaluru',
    delivery_deadline: new Date(Date.now() + 259200000).toISOString(),
    response_deadline: new Date(Date.now() + 28800000).toISOString(),
    status: 'OPEN',
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
];

let applications = [
  {
    id: 'APP-001',
    demand_id: 'DEM-2026-001',
    farmer_id: 'user_farmer_1',
    farmer_name: 'Ramesh Gowda',
    farmer_location: 'Hosakote (18 km from hub)',
    offered_quantity: 300,
    offered_price: 24,
    offered_price_min: 23,
    offered_price_max: 25,
    pickup_mode: 'farmgate',
    transit_buffer_tolerance_accepted: true,
    status: 'SELECTED',
    utility_score: 91.5,
  },
  {
    id: 'APP-002',
    demand_id: 'DEM-2026-001',
    farmer_id: 'farmer_2',
    farmer_name: 'Suresh Patil (Chintamani)',
    farmer_location: 'Chintamani, Kolar (38 km from hub)',
    offered_quantity: 200,
    offered_price: 25,
    offered_price_min: 24,
    offered_price_max: 26,
    pickup_mode: 'farmgate',
    transit_buffer_tolerance_accepted: true,
    status: 'SELECTED',
    utility_score: 87.2,
  },
];

const marketPrices = [
  { commodity: 'Tomatoes', mandi: 'Kolar APMC', spot_price: 28.5, model_price: 27.0, arrivals_mt: 340, trend: 'up' },
  { commodity: 'Onions (Red)', mandi: 'Yeshwanthpur', spot_price: 36.0, model_price: 34.5, arrivals_mt: 510, trend: 'stable' },
  { commodity: 'Potatoes (Chipsona)', mandi: 'Hassan APMC', spot_price: 21.0, model_price: 20.0, arrivals_mt: 290, trend: 'down' },
  { commodity: 'Green Chillies', mandi: 'Chikkaballapur', spot_price: 45.0, model_price: 42.0, arrivals_mt: 95, trend: 'up' },
  { commodity: 'Capsicum', mandi: 'Hosakote Sub-Market', spot_price: 38.0, model_price: 36.0, arrivals_mt: 120, trend: 'down' },
];

// --- 1. HEALTH CHECK ---
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'KrishiLink Agritech Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    users_count: users.length,
    demands_count: demands.length,
  });
});

// --- 2. GOOGLE OAUTH & AUTHENTICATION ENDPOINTS ---
// Get Google OAuth Authorization URL
app.get('/api/auth/google/url', (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
  const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const redirectUri = `${appUrl}/auth/callback`;

  if (!clientId) {
    // Return empty or fallback info so client can use direct Google Sign-in dialog
    return res.json({
      configured: false,
      message: 'Google Client ID not configured. Using client-side Google auth modal.',
      redirect_uri: redirectUri,
    });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return res.json({
    configured: true,
    url: authUrl,
    redirect_uri: redirectUri,
  });
});

// OAuth Callback Routes (Supports /auth/callback, /api/auth/google/callback, etc.)
app.get(
  [
    '/auth/callback',
    '/auth/callback/',
    '/api/auth/callback',
    '/api/auth/google/callback',
    '/api/auth/google/callback/'
  ],
  async (req: Request, res: Response) => {
    const code = req.query.code;
    const queryError = req.query.error;
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET;
    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${appUrl}/auth/callback`;

    let userEmail = '';
    let userName = '';
    let userAvatar = '';
    let errorMessage = queryError ? String(queryError) : '';

    if (code && !errorMessage) {
      if (clientId && clientSecret) {
        try {
          const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              code: String(code),
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: redirectUri,
              grant_type: 'authorization_code',
            }).toString(),
          });
          const tokens: any = await tokenRes.json();
          if (tokens.error) {
            errorMessage = tokens.error_description || tokens.error;
          } else {
            // Decode id_token or fetch userinfo
            if (tokens.id_token) {
              try {
                const payloadB64 = tokens.id_token.split('.')[1];
                const payloadStr = Buffer.from(payloadB64, 'base64').toString('utf8');
                const parsed = JSON.parse(payloadStr);
                userEmail = parsed.email || '';
                userName = parsed.name || '';
                userAvatar = parsed.picture || '';
              } catch (e) {
                // fall through to userinfo
              }
            }
            if (!userEmail && tokens.access_token) {
              const uInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
              });
              const uInfo: any = await uInfoRes.json();
              userEmail = uInfo.email || '';
              userName = uInfo.name || '';
              userAvatar = uInfo.picture || '';
            }
          }
        } catch (exchangeErr: any) {
          errorMessage = exchangeErr.message || 'Token exchange failed';
        }
      } else {
        // If client secret is not supplied, send code back so client or fallback can handle
        errorMessage = 'Google Client Secret not configured in environment.';
      }
    }

    const isSuccess = Boolean(userEmail && !errorMessage);

    res.setHeader('Content-Type', 'text/html');
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Agree Direct - Google Sign-In</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: #14241A;
            color: #FFFFFF;
          }
          .card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 2.5rem;
            border-radius: 24px;
            border: 1px solid rgba(74, 222, 128, 0.25);
            text-align: center;
            max-width: 420px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          }
          .spinner {
            width: 36px;
            height: 36px;
            border: 3px solid rgba(255, 255, 255, 0.2);
            border-top-color: #4ADE80;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 1.25rem;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          .badge {
            display: inline-block;
            padding: 0.35rem 0.85rem;
            background: rgba(74, 222, 128, 0.15);
            color: #4ADE80;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            border: 1px solid rgba(74, 222, 128, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="spinner"></div>
          <span class="badge">${isSuccess ? 'Google Account Verified' : 'Authentication Result'}</span>
          <h2 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; color: #FFFFFF;">
            ${isSuccess ? 'Welcome ' + (userName || 'Google User') : 'Processing Sign-In...'}
          </h2>
          <p style="margin: 0; color: rgba(255, 255, 255, 0.7); font-size: 0.875rem;">
            ${isSuccess ? 'Redirecting back to Agree Direct Operations Desk...' : 'Finalizing handshake...'}
          </p>
        </div>
        <script>
          const isSuccess = ${JSON.stringify(isSuccess)};
          const payload = isSuccess ? {
            type: 'OAUTH_AUTH_SUCCESS',
            provider: 'google',
            email: ${JSON.stringify(userEmail)},
            name: ${JSON.stringify(userName)},
            avatar_url: ${JSON.stringify(userAvatar)}
          } : {
            type: 'OAUTH_AUTH_FAILURE',
            provider: 'google',
            error: ${JSON.stringify(errorMessage || 'Google authentication could not be completed')}
          };

          if (window.opener) {
            try {
              window.opener.postMessage(payload, '*');
            } catch (e) {
              console.error(e);
            }
            setTimeout(() => window.close(), 600);
          } else {
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
          }
        </script>
      </body>
    </html>
  `);
  }
);

// Direct Google Authentication POST Endpoint
app.post('/api/auth/google', (req: Request, res: Response) => {
  const { email, name, avatar_url, role, organization, location } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Google email is required' });
  }

  // Find existing user or register new user
  let existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    // Return existing user with their locked role
    return res.json({
      success: true,
      user: existingUser,
      isNewUser: false,
    });
  }

  // If new user, create account with the chosen role
  const assignedRole = role || 'buyer';
  const newUser: UserRecord = {
    id: `google_${Date.now()}`,
    name: name || 'Google User',
    phone: '+91 98000 00000',
    email: email.toLowerCase(),
    role: assignedRole,
    location: location || (assignedRole === 'farmer' ? 'Kolar Rural' : 'Bengaluru Urban'),
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    organization: organization || (assignedRole === 'buyer' ? 'Commercial Procurement' : assignedRole === 'farmer' ? 'Farmer Producer Group' : 'Logistics Partner'),
    avatar_url: avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
  };

  users.unshift(newUser);

  return res.status(201).json({
    success: true,
    user: newUser,
    isNewUser: true,
  });
});

// Standard Login Endpoint
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;

  let matchedUser: UserRecord | undefined;
  if (email) {
    matchedUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  } else if (role) {
    matchedUser = users.find((u) => u.role === role);
  }

  if (!matchedUser) {
    return res.status(404).json({ error: 'User not found. Please create an account.' });
  }

  return res.json({
    success: true,
    user: matchedUser,
  });
});

// Standard Signup Endpoint
app.post('/api/auth/signup', (req: Request, res: Response) => {
  const { name, phone, email, role, location, organization } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are mandatory.' });
  }

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
  }

  const newUser: UserRecord = {
    id: `user_${role}_${Date.now()}`,
    name,
    phone: phone || '+91 98000 11223',
    email: email.toLowerCase(),
    role,
    location: location || 'Bengaluru Cluster',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    organization: organization || `${name}'s Organization`,
  };

  users.unshift(newUser);

  return res.status(201).json({
    success: true,
    user: newUser,
  });
});

// Current Users List (API inspect)
app.get('/api/users', (req: Request, res: Response) => {
  res.json({ users });
});

// --- 3. DEMANDS API ---
// List Demands
app.get('/api/demands', (req: Request, res: Response) => {
  const { status, commodity } = req.query;
  let filtered = [...demands];

  if (status) {
    filtered = filtered.filter((d) => d.status === status);
  }
  if (commodity) {
    filtered = filtered.filter((d) => d.commodity.toLowerCase().includes(String(commodity).toLowerCase()));
  }

  res.json({ demands: filtered, count: filtered.length });
});

// Create New Demand
app.post('/api/demands', (req: Request, res: Response) => {
  const {
    buyer_id,
    buyer_name,
    commodity,
    quantity_required,
    quality_requirement,
    target_price,
    target_price_min,
    target_price_max,
    delivery_location,
    delivery_deadline,
  } = req.body;

  if (!commodity || !quantity_required || !target_price) {
    return res.status(400).json({ error: 'Commodity, quantity, and price are required.' });
  }

  const qty = Number(quantity_required);
  const targetPrice = Number(target_price);
  const tolerancePct = 5;
  const bufferKg = Math.round(qty * 0.05);

  const newDemand = {
    id: `DEM-2026-${String(demands.length + 1).padStart(3, '0')}`,
    buyer_id: buyer_id || 'user_buyer_1',
    buyer_name: buyer_name || 'Commercial Procurement Partner',
    buyer_type: 'Hotel/Restaurant',
    commodity,
    quantity_required: qty,
    quality_requirement: quality_requirement || 'Grade A',
    target_price: targetPrice,
    target_price_min: target_price_min ? Number(target_price_min) : Math.round(targetPrice * 0.95),
    target_price_max: target_price_max ? Number(target_price_max) : Math.round(targetPrice * 1.05),
    quantity_tolerance_pct: tolerancePct,
    damage_transit_buffer_kg: bufferKg,
    acceptable_min_quantity: qty - bufferKg,
    acceptable_max_quantity: qty + bufferKg,
    is_negotiable: true,
    delivery_location: delivery_location || 'Indiranagar, Bengaluru',
    delivery_deadline: delivery_deadline || new Date(Date.now() + 86400000).toISOString(),
    response_deadline: new Date(Date.now() + 1800000).toISOString(), // 30 min default
    status: 'OPEN',
    created_at: new Date().toISOString(),
  };

  demands.unshift(newDemand);
  res.status(201).json({ success: true, demand: newDemand });
});

// Get Specific Demand with its Bids
app.get('/api/demands/:id', (req: Request, res: Response) => {
  const demand = demands.find((d) => d.id === req.params.id);
  if (!demand) {
    return res.status(404).json({ error: 'Demand not found' });
  }
  const relatedApps = applications.filter((a) => a.demand_id === req.params.id);
  res.json({ demand, applications: relatedApps });
});

// Submit Farmer Bid
app.post('/api/demands/:id/bids', (req: Request, res: Response) => {
  const { farmer_id, farmer_name, offered_quantity, offered_price, pickup_mode } = req.body;
  const demand = demands.find((d) => d.id === req.params.id);

  if (!demand) {
    return res.status(404).json({ error: 'Demand not found' });
  }

  const price = Number(offered_price) || demand.target_price;
  const newApp = {
    id: `APP-${Date.now().toString().slice(-4)}`,
    demand_id: demand.id,
    farmer_id: String(farmer_id || 'user_farmer_1'),
    farmer_name: String(farmer_name || 'Farmer Producer'),
    farmer_location: 'Karnataka Horticulture Cluster',
    offered_quantity: Number(offered_quantity) || 100,
    offered_price: price,
    offered_price_min: Math.round(price * 0.95),
    offered_price_max: Math.round(price * 1.05),
    pickup_mode: String(pickup_mode || 'farmgate'),
    transit_buffer_tolerance_accepted: true,
    status: 'APPLIED',
    utility_score: 88.0,
  };

  applications.push(newApp);
  res.status(201).json({ success: true, application: newApp });
});

// Confirm Demand Match (Buyer action)
app.post('/api/demands/:id/confirm', (req: Request, res: Response) => {
  const demand = demands.find((d) => d.id === req.params.id);
  if (!demand) return res.status(404).json({ error: 'Demand not found' });

  demand.status = 'CONFIRMED';
  res.json({ success: true, demand });
});

// --- 4. LOGISTICS & ROUTING API ---
app.get('/api/logistics/routes', (req: Request, res: Response) => {
  res.json({
    routes: [
      {
        id: 'ROUTE-001',
        demand_id: 'DEM-2026-001',
        carrier: 'Kisan Express Freight (KA-04-TR-9988)',
        total_tonnage_kg: 500,
        estimated_transit_hours: 3.5,
        damage_buffer_allowance_kg: 25,
        stops: [
          { stop: 1, type: 'pickup', location: 'Hosakote Farmgate (Ramesh Gowda)', qty_kg: 300, status: 'completed' },
          { stop: 2, type: 'pickup', location: 'Chintamani FPO Hub (Suresh Patil)', qty_kg: 200, status: 'in_progress' },
          { stop: 3, type: 'delivery', location: 'Indiranagar Central Kitchen', qty_kg: 500, status: 'pending' },
        ],
      },
    ],
  });
});

// --- 5. APMC MARKET PRICES & CURRENT TRENDS API ---
app.get('/api/market-prices', (req: Request, res: Response) => {
  res.json({
    market_prices: marketPrices,
    updated_at: new Date().toISOString(),
    apmc_state: 'Karnataka',
  });
});

// Real-Time Market Trends (Peak selling points, highest demand, gluts)
app.get('/api/market/trends', (req: Request, res: Response) => {
  res.json({
    success: true,
    benchmark_mandi: 'Kolar & Yeshwanthpur APMC Hubs',
    updated_at: new Date().toISOString(),
    highlights: {
      highest_selling_point: {
        commodity: 'G4 Green Chillies',
        direct_contract_price: 62.0,
        peak_time_price: 68.0,
        selling_point_score: 94,
        is_peak: true
      },
      most_demanded: {
        commodity: 'Hybrid Roma Tomatoes',
        current_demand_kg: 18500,
        growth_pct: 48.2,
        active_buyers: 14
      },
      not_at_peak: [
        { commodity: 'Red Onions (Nashik/Challakere)', current_price: 27.5, peak_price: 55.0, status: 'Off-Peak / Low Rate' },
        { commodity: 'Jyoti Potatoes', current_price: 21.0, peak_price: 32.0, status: 'Off-Peak' }
      ],
      zero_demand_gluts: [
        { commodity: 'Bottle Gourd (Lauki)', demand_kg: 0, reason: 'Severe regional oversupply (>420% glut)' },
        { commodity: 'White Cauliflower (Snowball)', demand_kg: 0, reason: 'Market glut, zero commercial procurement bids' }
      ]
    }
  });
});

// Machine Learning Crop Suggestions Engine API
app.get('/api/ml/crop-suggestions', (req: Request, res: Response) => {
  const soil = String(req.query.soil || 'Red Loamy Soil');
  const water = String(req.query.water || 'Borewell / Drip');
  const acres = Number(req.query.acres) || 1;

  res.json({
    success: true,
    model_version: 'v3.4-demand-learning',
    query_params: { soil, water, acres },
    recommendations: [
      {
        id: 'ML-CROP-001',
        crop_name: 'English Seedless Cucumber (Greenhouse/Trellis)',
        ml_demand_score: 98,
        unmet_demand_kg: 24500,
        buyers_waiting_count: 16,
        projected_harvest_price: '₹32 - ₹38/kg',
        estimated_net_profit_total: 215000 * acres,
        profit_roi_pct: 290,
        harvest_cycle_days: 48,
        demand_driver: 'Surge in salad bar and cloud kitchen forward contracts with zero local farmer commitments for next month.',
        avoid_alternate_warning: 'Swap Bottle Gourd (0 kg demand) with English Cucumber for 6x profit margin.'
      },
      {
        id: 'ML-CROP-002',
        crop_name: 'G4 Hot Green Chillies (High Pungency)',
        ml_demand_score: 96,
        unmet_demand_kg: 19800,
        buyers_waiting_count: 12,
        projected_harvest_price: '₹58 - ₹68/kg',
        estimated_net_profit_total: 245000 * acres,
        profit_roi_pct: 320,
        harvest_cycle_days: 72,
        demand_driver: 'Spices exporters and paste processing plants reporting 35% APMC supply deficit across South India.'
      },
      {
        id: 'ML-CROP-003',
        crop_name: 'Polyhouse Colored Capsicum (Yellow & Red Bell Peppers)',
        ml_demand_score: 92,
        unmet_demand_kg: 14200,
        buyers_waiting_count: 9,
        projected_harvest_price: '₹50 - ₹62/kg',
        estimated_net_profit_total: 280000 * acres,
        profit_roi_pct: 350,
        harvest_cycle_days: 85,
        demand_driver: 'Premium HoReCa demand consistently exceeding available Grade A arrivals by 4.2x.'
      }
    ],
    caution_crops_to_avoid: [
      'Bottle Gourd (0 kg demand, prices crashed below cost)',
      'White Cauliflower (Regional market saturation)'
    ]
  });
});

// PURE ALGORITHMIC ML ENDPOINTS (Zero Heavy Weights, Deployable Anywhere on Vercel/GitHub)
app.get('/api/ml/price-forecast', (req: Request, res: Response) => {
  const commodity = (req.query.commodity as string) || 'Hybrid Roma Tomatoes';
  const days = parseInt((req.query.days as string) || '14', 10);
  
  // Algorithmic statistical baseline model
  const basePrices: Record<string, { base: number; dailySlope: number; vol: number }> = {
    'Hybrid Roma Tomatoes': { base: 24.5, dailySlope: 0.021, vol: 46 },
    'G4 Hot Green Chillies': { base: 62.0, dailySlope: 0.018, vol: 38 },
    'Red Onions (Nashik/Challakere)': { base: 27.5, dailySlope: -0.012, vol: 52 },
    'English Seedless Cucumber': { base: 32.0, dailySlope: 0.019, vol: 26 },
    'Polyhouse Colored Capsicum': { base: 52.0, dailySlope: 0.016, vol: 32 },
    'Jyoti Cold-Storage Potatoes': { base: 21.0, dailySlope: 0.003, vol: 16 },
    'Bottle Gourd (Lauki)': { base: 6.5, dailySlope: -0.035, vol: 64 },
  };

  const model = basePrices[commodity] || { base: 25.0, dailySlope: 0.01, vol: 35 };
  const forecast = [];
  const now = new Date();

  for (let i = 0; i <= days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const trendPrice = model.base * Math.pow(1 + model.dailySlope, i);
    const seasonalWave = Math.sin(i * 0.9) * (model.base * 0.018);
    const predicted = Number(Math.max(3, trendPrice + seasonalWave).toFixed(1));
    const se = 0.03 + 0.007 * Math.sqrt(i);

    forecast.push({
      day_index: i,
      date: d.toISOString().split('T')[0],
      predicted_price: predicted,
      lower_bound: Number((predicted * (1 - se)).toFixed(1)),
      upper_bound: Number((predicted * (1 + se)).toFixed(1)),
      mandi_benchmark: Number((predicted * 0.94).toFixed(1)),
    });
  }

  const p0 = forecast[0].predicted_price;
  const pEnd = forecast[forecast.length - 1].predicted_price;
  const changePct = Number((((pEnd - p0) / p0) * 100).toFixed(1));

  res.json({
    success: true,
    engine: 'Algorithmic Time-Series Regression (Deterministic)',
    deployment_profile: 'Vercel / GitHub / Cloud Run Edge Ready',
    commodity,
    horizon_days: days,
    current_price: p0,
    projected_price: pEnd,
    change_pct: changePct,
    trend: changePct > 3 ? 'BULLISH' : changePct < -3 ? 'BEARISH' : 'NEUTRAL',
    points: forecast
  });
});

app.get('/api/ml/trending-analytics', (req: Request, res: Response) => {
  res.json({
    success: true,
    engine: 'Algorithmic Demand-Velocity Index',
    timestamp: new Date().toISOString(),
    leaderboard: [
      { id: '1', commodity: 'G4 Hot Green Chillies', trend_velocity: 96, weekly_change: '+20.2%', action: 'HARVEST_NOW' },
      { id: '2', commodity: 'English Seedless Cucumber', trend_velocity: 94, weekly_change: '+20.3%', action: 'FORWARD_CONTRACT' },
      { id: '3', commodity: 'Hybrid Roma Tomatoes', trend_velocity: 91, weekly_change: '+29.8%', action: 'HOLD_HARVEST' },
      { id: '4', commodity: 'Polyhouse Colored Capsicum', trend_velocity: 87, weekly_change: '+17.3%', action: 'FORWARD_CONTRACT' },
      { id: '5', commodity: 'Bottle Gourd (Lauki)', trend_velocity: 12, weekly_change: '-23.1%', action: 'AVOID_SOWING' }
    ]
  });
});

// Produce Computer Vision (CV) Multimodal Recognition & Quality Assessment API
app.get('/api/cv/model-status', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: getVisionModelStatus()
  });
});

app.post('/api/cv/analyze-produce', async (req: Request, res: Response) => {
  try {
    const { image, farmerId, preferredModel, commodityHint } = req.body;
    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'Missing required produce image (data URL or http URL)'
      });
    }

    const assessment = await analyzeProduceProduceVision({
      image,
      farmerId: farmerId || 'farmer-1',
      preferredModel: preferredModel || 'auto',
      commodityHint
    });

    res.json({
      success: true,
      assessment
    });
  } catch (err: any) {
    console.error('Error in /api/cv/analyze-produce:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal computer vision assessment error'
    });
  }
});

// Start Server with Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KrishiLink Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
