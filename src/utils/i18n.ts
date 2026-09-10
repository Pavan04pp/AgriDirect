import { Language } from '../types';

export const TRANSLATIONS = {
  kn: {
    // Top Navigation & General
    app_name: 'ಅಗ್ರಿಡೈರೆಕ್ಟ್ (Agridirect)',
    platform_subtitle: 'ರೈತರಿಂದ ನೇರ ಖರೀದಿ ಮತ್ತು ಸಂಧಾನ ವೇದಿಕೆ',
    language: 'ಭಾಷೆ',
    kannada: 'ಕನ್ನಡ',
    english: 'English',
    hindi: 'हिन्दी',
    role_buyer: 'ವ್ಯಾಪಾರಿ (Buyer)',
    role_farmer: 'ರೈತ (Farmer)',
    role_logistics: 'ಸಾರಿಗೆ (Logistics)',
    role_admin: 'ಆಡಳಿತ (Admin)',

    // Farmer Interface
    simple_farmer_mode: 'ಸುಲಭ ರೈತ ವೀಕ್ಷಣೆ',
    detailed_mode: 'ತಾಂತ್ರಿಕ ವೀಕ್ಷಣೆ',
    farmer_welcome: 'ನಮಸ್ಕಾರ, ರೈತ ಬಾಂಧವರೇ!',
    farmer_instruction: 'ವ್ಯಾಪಾರಿಗಳ ಬೇಡಿಕೆ ನೋಡಿ, ನಿಮ್ಮ ಬೆಲೆಯಲ್ಲಿ ನೇರವಾಗಿ ಬೆಳೆ ಮಾರಾಟ ಮಾಡಿ.',
    farmer_tip: 'ಸುಲಭ ಮಾರ್ಗದರ್ಶಿ: ನಿಮ್ಮ ಬೆಳೆ, ಪ್ರಮಾಣ (ಕೆ.ಜಿ) ಮತ್ತು ನೀವು ಒಪ್ಪುವ ಬೆಲೆ ಶ್ರೇಣಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಸಾಕು.',
    my_produce: 'ನನ್ನ ಬೆಳೆ ದಾಸ್ತಾನು',
    available_stock: 'ಮಾರಾಟಕ್ಕೆ ಸಿದ್ಧವಿರುವ ಬೆಳೆ',
    locked_stock: 'ಬುಕ್ ಆಗಿರುವ ಬೆಳೆ (ಕಾಯ್ದಿರಿಸಿದ)',
    total_capacity: 'ಒಟ್ಟು ಸಾಮರ್ಥ್ಯ',
    reliability_score: 'ನಂಬಿಕಾರ್ಹತೆ ಸ್ಕೋರ್',
    fpo_member: 'ಎಫ್.ಪಿ.ಒ ಸದಸ್ಯ',
    quality_check_btn: 'ಬೆಳೆ ಗುಣಮಟ್ಟ ಫೋಟೋ ಚೆಕ್',

    // Demands to Sell
    live_demands_to_sell: 'ಪ್ರಸ್ತುತ ಖರೀದಿದಾರರ ಬೇಡಿಕೆಗಳು (ಮಾರಾಟ ಮಾಡಿ)',
    demand_card_need: 'ಅಗತ್ಯವಿರುವ ಪ್ರಮಾಣ',
    target_price: 'ಖರೀದಿದಾರರ ಅಪೇಕ್ಷಿತ ಬೆಲೆ',
    price_range: 'ಬೆಲೆ ಶ್ರೇಣಿ (ಕನಿಷ್ಠ - ಗರಿಷ್ಠ)',
    negotiable_badge: 'ಸಂಧಾನ ಸಾಧ್ಯ (Negotiable)',
    tolerance_badge: '±5% ಸಾಗಾಣಿಕೆ ಹಾನಿ ಸಡಿಲಿಕೆ (10-25 ಕೆ.ಜಿ)',
    damage_buffer_note: 'ರಸ್ತೆಯ ಸಾಗಾಣಿಕೆಯಲ್ಲಿ ಉಂಟಾಗುವ ಸಣ್ಣಪುಟ್ಟ ಹಾನಿ (10-25 ಕೆ.ಜಿ) ಸ್ವೀಕಾರಾರ್ಹ.',
    sell_now_btn: 'ಬೆಳೆ ಮಾರಾಟ ಮಾಡಿ',
    applied_badge: 'ಪ್ರಸ್ತಾಪ ಕಳುಹಿಸಲಾಗಿದೆ',

    // Application Modal
    modal_title: 'ಬೆಳೆ ಮಾರಾಟದ ಪ್ರಸ್ತಾಪ ಸಲ್ಲಿಸಿ',
    how_much_to_sell: 'ನೀವು ಮಾರಾಟ ಮಾಡಲು ಬಯಸುವ ತೂಕ (ಕೆ.ಜಿ)',
    max_available_note: 'ನಿಮ್ಮಲ್ಲಿ ಮಾರಾಟಕ್ಕೆ ಲಭ್ಯವಿರುವುದು:',
    price_range_input_title: 'ನಿಮ್ಮ ಬೆಲೆ ಶ್ರೇಣಿ (₹ ಪ್ರತಿ ಕೆ.ಜಿ)',
    min_acceptable_price: 'ಕನಿಷ್ಠ ಒಪ್ಪುವ ಬೆಲೆ (₹/ಕೆ.ಜಿ)',
    expected_price: 'ನಿರೀಕ್ಷಿತ ಗರಿಷ್ಠ ಬೆಲೆ (₹/ಕೆ.ಜಿ)',
    tolerance_toggle_label: '±5% ಸಾಗಾಣಿಕೆ ಹಾನಿ ಹೊಂದಾಣಿಕೆಗೆ ಸಮ್ಮತ (ಸುಮಾರು 10-25 ಕೆ.ಜಿ)',
    tolerance_toggle_sub: 'ಸಾಗಾಣಿಕೆಯಲ್ಲಿ ಹಾಳಾಗುವ ಅಲ್ಪ ಪ್ರಮಾಣಕ್ಕೆ ವ್ಯಾಪಾರಿಯೊಂದಿಗೆ ಹೊಂದಿಕೊಳ್ಳುವುದು',
    pickup_mode_title: 'ಬೆಳೆ ಸಂಗ್ರಹಣೆ ಹೇಗೆ?',
    farm_pickup: 'ನನ್ನ ಜಮೀನಿನಿಂದಲೇ ವಾಹನ ಬಂದು ಕೊಂಡೊಯ್ಯಲಿ (ಫಾರ್ಮ್‌ಗೇಟ್)',
    hub_drop: 'ನಾನೇ ಹತ್ತಿರದ ಮಂಡಿಗೆ/ಕೇಂದ್ರಕ್ಕೆ ತಲುಪಿಸುತ್ತೇನೆ (ಹಬ್ ಡ್ರಾಪ್)',
    notes_optional: 'ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ (ಉದಾ: ತಾಜಾ ಕೊಯ್ಲು ಮಾಡಿದ ಟೊಮ್ಯಾಟೊ)',
    confirm_and_submit: 'ಮಾರಾಟ ಪ್ರಸ್ತಾಪ ಖಚಿತಪಡಿಸಿ',
    estimated_earnings: 'ನಿಮ್ಮ ಅಂದಾಜು ಆದಾಯ:',
    cancel: 'ರದ್ದುಮಾಡಿ',

    // Farmer My Offers
    my_submitted_offers: 'ನನ್ನ ಮಾರಾಟ ಪ್ರಸ್ತಾಪಗಳು',
    no_offers_yet: 'ನೀವಿನ್ನೂ ಯಾವುದೇ ಬೇಡಿಕೆಗೆ ಮಾರಾಟ ಪ್ರಸ್ತಾಪ ಸಲ್ಲಿಸಿಲ್ಲ.',
    status_under_review: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    status_selected: 'ಆಯ್ಕೆಯಾಗಿದೆ (ಅಂತಿಮ ಒಪ್ಪಿಗೆ ಬಾಕಿ)',
    status_confirmed: 'ಆರ್ಡರ್ ದೃಢಪಟ್ಟಿದೆ!',
    status_not_selected: 'ಆಯ್ಕೆಯಾಗಿಲ್ಲ',

    // Buyer & Matching
    buyer_title: 'ವ್ಯಾಪಾರ ಬೇಡಿಕೆಗಳ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    post_demand_btn: 'ಹೊಸ ಬೆಳೆ ಬೇಡಿಕೆ ಹಾಕಿ',
    acceptance_timer_label: '30-ನಿಮಿಷದ ಒಪ್ಪಿಗೆ ಸಮಯ',
    time_remaining: 'ಉಳಿದ ಸಮಯ',
    auto_rejected_label: '30-ನಿಮಿಷ ಮುಗಿದು ಸ್ವಯಂ-ರದ್ದಾಗಿದೆ',
    confirmed_locked_label: 'ದೃಢೀಕರಿಸಿ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ',
    review_and_confirm: 'ಪರಿಶೀಲಿಸಿ ಒಪ್ಪಿಗೆ ನೀಡಿ',
    reopen_demand: 'ಮತ್ತೆ ತೆರೆಯಿರಿ / ಬದಲಾಯಿಸಿ',

    // Common
    tomatoes: 'ಟೊಮ್ಯಾಟೊ (Tomatoes)',
    onions: 'ಈರುಳ್ಳಿ (Onions)',
    potatoes: 'ಆಲೂಗಡ್ಡೆ (Potatoes)',
    grade_a: 'ಗ್ರೇಡ್ ಎ (ಉತ್ತಮ ಗುಣಮಟ್ಟ)',
    grade_b: 'ಗ್ರೇಡ್ ಬಿ (ಮಧ್ಯಮ ಗುಣಮಟ್ಟ)',
    grade_c: 'ಗ್ರೇಡ್ ಸಿ (ಸಾಮಾನ್ಯ)',
    kg: 'ಕೆ.ಜಿ',
    rs: '₹',
    per_kg: '/ಕೆ.ಜಿ'
  },
  en: {
    // Top Navigation & General
    app_name: 'Agridirect',
    platform_subtitle: 'Direct Farm-to-Enterprise Demand & Negotiation Engine',
    language: 'Language',
    kannada: 'ಕನ್ನಡ',
    english: 'English',
    hindi: 'हिन्दी',
    role_buyer: 'Buyer Desk',
    role_farmer: 'Farmer Desk',
    role_logistics: 'Logistics',
    role_admin: 'Admin',

    // Farmer Interface
    simple_farmer_mode: 'Simple Farmer Mode',
    detailed_mode: 'Detailed View',
    farmer_welcome: 'Welcome, Farmer Partner!',
    farmer_instruction: 'Browse active buyer requirements and sell your produce directly at transparent prices.',
    farmer_tip: 'Simple Guide: Check how much crop is needed, set your quantity and acceptable price range, then submit.',
    my_produce: 'My Produce Inventory',
    available_stock: 'Available in Stock',
    locked_stock: 'Committed / Locked',
    total_capacity: 'Total Capacity',
    reliability_score: 'Reliability Score',
    fpo_member: 'FPO Member',
    quality_check_btn: 'Produce Quality Check',

    // Demands to Sell
    live_demands_to_sell: 'Active Buyer Demands (Available to Sell)',
    demand_card_need: 'Quantity Required',
    target_price: 'Buyer Target Price',
    price_range: 'Acceptable Price Range',
    negotiable_badge: 'Negotiable',
    tolerance_badge: '±5% Transit Damage Buffer (10–25 kg)',
    damage_buffer_note: 'Road transit damage/breakage tolerance allowed (approx. 10–25 kg buffer).',
    sell_now_btn: 'Sell Produce',
    applied_badge: 'Offer Submitted',

    // Application Modal
    modal_title: 'Submit Supply Offer',
    how_much_to_sell: 'Quantity You Want to Sell (kg)',
    max_available_note: 'Available in your stock:',
    price_range_input_title: 'Your Price Range (₹ per kg)',
    min_acceptable_price: 'Minimum Acceptable Price (₹/kg)',
    expected_price: 'Expected / Preferred Price (₹/kg)',
    tolerance_toggle_label: '±5% Transit Damage Buffer Allowed (approx. 10–25 kg)',
    tolerance_toggle_sub: 'Enables buyer tolerance for minor road damage during pickup and transit',
    pickup_mode_title: 'How should produce be collected?',
    farm_pickup: 'Collect from my farm (Farmgate Pickup)',
    hub_drop: 'I will bring to aggregation center (Hub Dropoff)',
    notes_optional: 'Optional note (e.g. freshly harvested tomatoes in crates)',
    confirm_and_submit: 'Confirm & Submit Offer',
    estimated_earnings: 'Your Estimated Earnings:',
    cancel: 'Cancel',

    // Farmer My Offers
    my_submitted_offers: 'My Submitted Offers',
    no_offers_yet: 'You have not submitted offers for any demands yet.',
    status_under_review: 'Under Evaluation',
    status_selected: 'Selected (Awaiting Buyer Confirmation)',
    status_confirmed: 'Order Confirmed & Locked!',
    status_not_selected: 'Not Selected (Stock Released)',

    // Buyer & Matching
    buyer_title: 'Commercial Buyer Demands',
    post_demand_btn: 'Post New Demand',
    acceptance_timer_label: '30-Minute Acceptance Window',
    time_remaining: 'Time Remaining',
    auto_rejected_label: 'Auto-Rejected (00:00 Expired)',
    confirmed_locked_label: 'Confirmed & Locked',
    review_and_confirm: 'Review & Confirm',
    reopen_demand: 'Reopen / Modify Demand',

    // Common
    tomatoes: 'Tomatoes',
    onions: 'Onions',
    potatoes: 'Potatoes',
    grade_a: 'Grade A (Premium)',
    grade_b: 'Grade B (Standard)',
    grade_c: 'Grade C (Fair)',
    kg: 'kg',
    rs: '₹',
    per_kg: '/kg'
  },
  hi: {
    // Top Navigation & General
    app_name: 'एग्रीडायरेक्ट (Agridirect)',
    platform_subtitle: 'किसान से सीधी खरीद और मोलभाव मंच',
    language: 'भाषा',
    kannada: 'ಕನ್ನಡ',
    english: 'English',
    hindi: 'हिन्दी',
    role_buyer: 'खरीदार (Buyer)',
    role_farmer: 'किसान (Farmer)',
    role_logistics: 'रसद (Logistics)',
    role_admin: 'प्रबंधक (Admin)',

    // Farmer Interface
    simple_farmer_mode: 'सरल किसान मोड',
    detailed_mode: 'विस्तृत दृश्य',
    farmer_welcome: 'नमस्ते किसान भाई!',
    farmer_instruction: 'खरीदारों की मांग देखें और अपनी फसल उचित मूल्य पर सीधे बेचें।',
    farmer_tip: 'सरल मार्गदर्शिका: अपनी फसल, मात्रा (किग्रा) और मूल्य सीमा चुनें और सीधे बेचें।',
    my_produce: 'मेरी फसल का भंडार',
    available_stock: 'बिक्री के लिए उपलब्ध',
    locked_stock: 'आरक्षित फसल (बुक्ड)',
    total_capacity: 'कुल क्षमता',
    reliability_score: 'विश्वसनीयता स्कोर',
    fpo_member: 'FPO सदस्य',
    quality_check_btn: 'फसल गुणवत्ता फोटो जांच',

    // Demands to Sell
    live_demands_to_sell: 'सक्रिय मांगें (फसल बेचने के अवसर)',
    demand_card_need: 'आवश्यक मात्रा',
    target_price: 'खरीदार का लक्षित मूल्य',
    price_range: 'मूल्य सीमा (न्यूनतम - अधिकतम)',
    negotiable_badge: 'मोलभाव संभव (Negotiable)',
    tolerance_badge: '±5% परिवहन क्षति छूट (10-25 किग्रा)',
    damage_buffer_note: 'रास्ते के परिवहन में 10-25 किग्रा मामूली नुकसान की छूट स्वीकार्य है।',
    sell_now_btn: 'फसल बेचें',
    applied_badge: 'प्रस्ताव भेजा गया',

    // Application Modal
    modal_title: 'फसल बिक्री प्रस्ताव दर्ज करें',
    how_much_to_sell: 'आप कितनी मात्रा बेचना चाहते हैं? (किग्रा)',
    max_available_note: 'आपके पास उपलब्ध मात्रा:',
    price_range_input_title: 'आपकी मूल्य सीमा (₹ प्रति किग्रा)',
    min_acceptable_price: 'न्यूनतम स्वीकार्य मूल्य (₹/किग्रा)',
    expected_price: 'अपेक्षित मूल्य (₹/किग्रा)',
    tolerance_toggle_label: '±5% परिवहन क्षति समायोजन स्वीकार (लगभग 10-25 किग्रा)',
    tolerance_toggle_sub: 'सड़क परिवहन के दौरान होने वाले थोड़े नुकसान पर खरीदार से तालमेल',
    pickup_mode_title: 'फसल कैसे उठाई जाए?',
    farm_pickup: 'मेरे खेत से ही गाड़ी ले जाए (फार्मगेट)',
    hub_drop: 'मैं खुद मंडी/केंद्र पर पहुँचाऊँगा (हब ड्रॉप)',
    notes_optional: 'अतिरिक्त जानकारी (जैसे: सुबह की ताज़ा तुड़ाई)',
    confirm_and_submit: 'प्रस्ताव पक्का करें और भेजें',
    estimated_earnings: 'आपकी अनुमानित कमाई:',
    cancel: 'रद्द करें',

    // Farmer My Offers
    my_submitted_offers: 'मेरे भेजे गए प्रस्ताव',
    no_offers_yet: 'आपने अभी तक कोई प्रस्ताव नहीं भेजा है।',
    status_under_review: 'समीक्षा जारी है',
    status_selected: 'चयनित (खरीदार की अंतिम सहमति बाकी)',
    status_confirmed: 'ऑर्डर पक्का हो गया!',
    status_not_selected: 'चयनित नहीं हुआ',

    // Buyer & Matching
    buyer_title: 'खरीदार की मांगें',
    post_demand_btn: 'नई मांग दर्ज करें',
    acceptance_timer_label: '30 मिनट की स्वीकृति अवधि',
    time_remaining: 'शेष समय',
    auto_rejected_label: 'समय समाप्त: स्वतः अस्वीकृत',
    confirmed_locked_label: 'स्वीकृत और आरक्षित',
    review_and_confirm: 'समीक्षा करें और स्वीकारें',
    reopen_demand: 'मांग पुनः खोलें / बदलें',

    // Common
    tomatoes: 'टमाटर (Tomatoes)',
    onions: 'प्याज (Onions)',
    potatoes: 'आलू (Potatoes)',
    grade_a: 'ग्रेड ए (उत्कृष्ट)',
    grade_b: 'ग्रेड बी (मानक)',
    grade_c: 'ग्रेड सी (साधारण)',
    kg: 'किग्रा',
    rs: '₹',
    per_kg: '/किग्रा'
  }
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;

export function getTranslation(lang: Language, key: TranslationKey): string {
  const currentLang = TRANSLATIONS[lang] || TRANSLATIONS.kn;
  return (currentLang as Record<string, string>)[key] || (TRANSLATIONS.en as Record<string, string>)[key] || key;
}
