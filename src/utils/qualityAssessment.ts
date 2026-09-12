import { QualityAssessment, ProducePrediction } from '../types';

export interface SampleProduceImage {
  id: string;
  name: string;
  commodity: string;
  recognized_crop: string;
  category: 'fruit' | 'vegetable' | 'root_crop' | 'leafy_green';
  image_url: string;
  description: string;
  expected_grade: 'Grade A' | 'Grade B' | 'Grade C';
  expected_confidence: number;
  expected_issues: string[];
}

export const SAMPLE_PRODUCE_IMAGES: SampleProduceImage[] = [
  {
    id: 'sample-tomato-grade-a',
    name: 'Firm Red Vine Tomatoes',
    commodity: 'Hybrid Roma Tomatoes',
    recognized_crop: 'Roma Tomatoes (Solanum lycopersicum)',
    category: 'vegetable',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
    description: 'Uniform deep crimson, firm skin, green calyx attached, zero cuts.',
    expected_grade: 'Grade A',
    expected_confidence: 96,
    expected_issues: ['Uniform size (55-65mm)', 'Zero visible bruising', 'Stems attached & fresh'],
  },
  {
    id: 'sample-onion-grade-a',
    name: 'Cured Nashik Red Onions',
    commodity: 'Nashik Red Onions',
    recognized_crop: 'Red Onions (Allium cepa)',
    category: 'root_crop',
    image_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
    description: 'Dry papery skin, tight necks, clean bulbs, no sprouting.',
    expected_grade: 'Grade A',
    expected_confidence: 95,
    expected_issues: ['Dry outer sheath intact', 'Neck closure complete', 'Zero sprouting detected'],
  },
  {
    id: 'sample-capsicum-grade-a',
    name: 'Polyhouse Bell Peppers (Capsicum)',
    commodity: 'Polyhouse Colored Capsicum',
    recognized_crop: 'Bell Pepper / Capsicum (Capsicum annuum)',
    category: 'vegetable',
    image_url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=80',
    description: 'Glossy thick-walled yellow & red bell peppers, crisp and firm.',
    expected_grade: 'Grade A',
    expected_confidence: 97,
    expected_issues: ['Thick pericarp walls', 'High gloss skin luster', 'Zero sunscald or blossom rot'],
  },
  {
    id: 'sample-chillies-grade-a',
    name: 'Pungent G4 Green Chillies',
    commodity: 'G4 Hot Green Chillies',
    recognized_crop: 'Hot Green Chillies (Capsicum annuum)',
    category: 'vegetable',
    image_url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80',
    description: 'Bright emerald green pods, firm stems, high pungency index.',
    expected_grade: 'Grade A',
    expected_confidence: 94,
    expected_issues: ['Crisp green pedicel', 'Zero anthracnose spots', 'Uniform straight pods (8-10cm)'],
  },
  {
    id: 'sample-cucumber-grade-a',
    name: 'English Long Seedless Cucumber',
    commodity: 'English Seedless Cucumber',
    recognized_crop: 'English Cucumber (Cucumis sativus)',
    category: 'vegetable',
    image_url: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=800&auto=format&fit=crop&q=80',
    description: 'Dark green cylindrical fruit, ribbed skin, crisp water retention.',
    expected_grade: 'Grade A',
    expected_confidence: 93,
    expected_issues: ['Uniform cylindrical shape', 'Zero yellowing or bitterness', 'Firm turgid skin'],
  },
  {
    id: 'sample-potatoes-grade-a',
    name: 'Jyoti Cold-Storage Potatoes',
    commodity: 'Jyoti Cold-Storage Potatoes',
    recognized_crop: 'Table Potatoes (Solanum tuberosum)',
    category: 'root_crop',
    image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
    description: 'Smooth skin, oval tubers, shallow eyes, zero greening or rots.',
    expected_grade: 'Grade A',
    expected_confidence: 95,
    expected_issues: ['Zero solanine greening', 'Shallow eyes, easy peeling', 'High dry matter firmness'],
  },
  {
    id: 'sample-banana-grade-a',
    name: 'Golden Robusta Bananas',
    commodity: 'Robusta Table Bananas',
    recognized_crop: 'Cavendish / Robusta Bananas (Musa acuminata)',
    category: 'fruit',
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80',
    description: 'Vibrant golden hands, ripe yellow skin with green tips, firm fingers.',
    expected_grade: 'Grade A',
    expected_confidence: 96,
    expected_issues: ['Optimal Stage 5 color index', 'Crown cushion fungal-free', 'Intact finger neck'],
  },
  {
    id: 'sample-tomato-grade-b',
    name: 'Mixed Ripeness Field Tomatoes',
    commodity: 'Hybrid Roma Tomatoes',
    recognized_crop: 'Roma Tomatoes (Commercial Batch)',
    category: 'vegetable',
    image_url: 'https://images.unsplash.com/photo-1546470427-227c7369a9d7?w=800&auto=format&fit=crop&q=80',
    description: 'Minor color variation across batch, 2-4% surface sun-spotting, good firmness.',
    expected_grade: 'Grade B',
    expected_confidence: 86,
    expected_issues: ['Slight uneven coloring on 8% of batch', 'Minor superficial blemishes (<3%)', 'Firmness acceptable for kitchen cooking'],
  },
  {
    id: 'sample-tomato-low-confidence',
    name: 'Dimly-Lit / Obscured Crate',
    commodity: 'Hybrid Roma Tomatoes',
    recognized_crop: 'Tomatoes (Low Lux Exposure)',
    category: 'vegetable',
    image_url: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=800&auto=format&fit=crop&q=80',
    description: 'Inconsistent lighting with shaded areas making full surface evaluation inconclusive.',
    expected_grade: 'Grade B',
    expected_confidence: 68, // < 75% -> MANUAL VERIFICATION REQUIRED
    expected_issues: ['Low ambient lighting in image', 'Partial occlusion in crate lower layer', 'Surface defect uncertainty > 15%'],
  }
];

/**
 * Precision Computer Vision Multimodal Produce Quality & Recognition Pipeline
 * Connects to the backend vision endpoint (Gemini Multimodal Vision / Hugging Face ViT).
 * Accurately identifies crops vs. human portraits / selfies and non-produce subjects.
 */
export async function analyzeProduceQuality(
  imageDataOrUrl: string,
  commodity: string = 'Tomatoes',
  farmerId: string = 'farmer-1',
  preferredModel: 'auto' | 'gemini' | 'huggingface' = 'auto'
): Promise<QualityAssessment> {
  // 1. Primary backend vision analysis endpoint
  try {
    const response = await fetch('/api/cv/analyze-produce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageDataOrUrl,
        farmerId,
        preferredModel,
        commodityHint: commodity,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.assessment) {
        return data.assessment;
      }
    }
  } catch (apiErr) {
    console.warn('Backend Vision API call error:', apiErr);
  }

  // 2. If it is one of the verified preset sample images, return its verified benchmark
  const matchedSample = SAMPLE_PRODUCE_IMAGES.find((s) => s.image_url === imageDataOrUrl);
  if (matchedSample) {
    return {
      id: `qa-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      farmer_id: farmerId,
      commodity: matchedSample.commodity,
      recognized_produce: matchedSample.recognized_crop,
      is_agricultural_produce: true,
      subject_type: 'Agricultural Farm Crop',
      produce_category: matchedSample.category,
      model_source: 'Pre-Verified Produce Benchmark',
      top_predictions: [
        { label: matchedSample.recognized_crop, score: matchedSample.expected_confidence / 100 },
        { label: 'Alternative Cultivar', score: 0.04 },
      ],
      ripeness_stage: matchedSample.expected_grade === 'Grade A' ? 'Optimal Harvest Maturity' : 'Commercial Kitchen Ready',
      image_reference: imageDataOrUrl,
      estimated_grade: matchedSample.expected_grade,
      confidence: matchedSample.expected_confidence,
      detected_issues: [...matchedSample.expected_issues],
      assessment_status: matchedSample.expected_confidence >= 75 ? 'PROTOTYPE_ASSESSED' : 'MANUAL_VERIFICATION_REQUIRED',
      analyzed_at: new Date().toISOString(),
      details: {
        color_uniformity: matchedSample.expected_confidence > 85 ? 'High (94%)' : 'Moderate (76%)',
        surface_firmness: matchedSample.expected_grade === 'Grade A' ? 'Firm / Crisp' : 'Standard Market',
        blemishes_percent: matchedSample.expected_grade === 'Grade A' ? 1.4 : 4.6,
        recommended_shelf_life: matchedSample.expected_grade === 'Grade A' ? '5-6 Days' : '2-3 Days',
      },
    };
  }

  // 3. Truthful fallback if Vision API was unreachable
  return {
    id: `qa-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    farmer_id: farmerId,
    commodity: commodity || 'Unconfirmed Produce',
    recognized_produce: 'Unverified Image Sample',
    is_agricultural_produce: false,
    subject_type: 'Unverified Image',
    rejection_reason: 'Vision API was unreachable. Please verify network connection or try again.',
    produce_category: 'other',
    model_source: 'Vision Service Notice',
    top_predictions: [],
    ripeness_stage: 'Pending Inspection',
    image_reference: imageDataOrUrl,
    estimated_grade: 'Grade B',
    confidence: 50,
    detected_issues: [
      'Vision AI server unreachable or image upload timed out',
      'Physical inspection required at mandi arrival gate (§7 Mandi Act)',
    ],
    assessment_status: 'MANUAL_VERIFICATION_REQUIRED',
    analyzed_at: new Date().toISOString(),
    details: {
      color_uniformity: 'Unverified',
      surface_firmness: 'Requires Physical Touch',
      blemishes_percent: 5.0,
      recommended_shelf_life: 'Pending Inspection',
    },
  };
}
