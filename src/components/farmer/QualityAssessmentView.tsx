import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { QualityAssessment } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SAMPLE_PRODUCE_IMAGES, SampleProduceImage } from '../../utils/qualityAssessment';
import {
  Sparkles,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Info,
  Cpu,
  BarChart3,
  Check,
  Link,
  RefreshCw,
  Eye,
  Tag,
  UserX,
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  Upload
} from 'lucide-react';

interface QualityAssessmentViewProps {
  onAssessmentCompleted?: (assessment: QualityAssessment) => void;
  commodity?: string;
  farmerId?: string;
}

type ModelChoice = 'auto' | 'gemini' | 'huggingface';

// Verified sample selfie for negative testing (verifies person detection & rejection)
const SAMPLE_SELFIE_URL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

export const QualityAssessmentView: React.FC<QualityAssessmentViewProps> = ({
  onAssessmentCompleted,
  commodity,
  farmerId,
}) => {
  const { runQualityAssessment, currentUser, qualityAssessments } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedSample, setSelectedSample] = useState<SampleProduceImage>(SAMPLE_PRODUCE_IMAGES[0]);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [preferredModel, setPreferredModel] = useState<ModelChoice>('auto');
  const [modelStatus, setModelStatus] = useState<{
    gemini_available: boolean;
    huggingface_available: boolean;
    default_model: string;
  } | null>(null);

  const activeFarmerId = farmerId || currentUser.id;
  const [currentAssessment, setCurrentAssessment] = useState<QualityAssessment | null>(
    qualityAssessments[`qa-${activeFarmerId}`] || null
  );

  // Fetch model status on mount
  useEffect(() => {
    fetch('/api/cv/model-status')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.status) {
          setModelStatus(data.status);
        }
      })
      .catch(() => {
        // Silently fallback to defaults
      });
  }, []);

  const handleRunScan = async (
    imgUrl: string,
    targetCommodity?: string,
    modelToUse: ModelChoice = preferredModel
  ) => {
    setAnalyzing(true);
    try {
      const comm = targetCommodity || commodity || 'Hybrid Roma Tomatoes';
      const assessment = await runQualityAssessment(imgUrl, comm, activeFarmerId, modelToUse);
      setCurrentAssessment(assessment);
      if (onAssessmentCompleted) {
        onAssessmentCompleted(assessment);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCustomImageUrl(dataUrl);
        handleRunScan(dataUrl, commodity || undefined);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setCustomImageUrl(inputUrl.trim());
    handleRunScan(inputUrl.trim(), commodity || undefined);
  };

  const isRejectedNonProduce =
    currentAssessment &&
    (currentAssessment.is_agricultural_produce === false ||
      currentAssessment.assessment_status === 'REJECTED_NON_PRODUCE' ||
      currentAssessment.produce_category === 'non_produce' ||
      currentAssessment.estimated_grade === 'Rejected (Non-Produce)');

  return (
    <div id="quality-assessment-studio" className="space-y-6">
      {/* Overview Banner & AI Model Engine Selector */}
      <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDD9CD]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-[#1C2321]">
                Multimodal Produce Classifier & Quality Inspector
              </span>
              <span className="px-2 py-0.5 rounded-[6px] bg-[#E4ECE0] text-[#2F5233] border border-[#2F5233]/20 text-xs font-semibold flex items-center gap-1">
                <Sparkles size={12} />
                High-Accuracy Vision AI
              </span>
            </div>
            <p className="text-xs text-[#5B6660] mt-0.5">
              Multimodal optical inspection verifies fresh produce taxonomy, rejects non-produce uploads (such as selfies or household objects), and certifies Agmark grades.
            </p>
          </div>

          {/* Upload & Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="upload-produce-btn"
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-[#2F5233] hover:bg-[#25401F] text-white text-xs font-semibold rounded-[10px] transition-colors shadow-sm"
            >
              <Camera size={15} />
              <span>Upload Produce Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Model Selection Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F7F6F2] p-3 rounded-[12px] border border-[#DDD9CD]">
          <div className="flex items-center gap-2 text-xs font-medium text-[#1C2321]">
            <Cpu size={15} className="text-[#2F5233]" />
            <span>AI Vision Engine:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                id: 'auto' as ModelChoice,
                label: 'Auto (Recommended)',
                desc: 'Gemini Multimodal Vision',
              },
              {
                id: 'gemini' as ModelChoice,
                label: 'Gemini Vision AI',
                desc: modelStatus?.gemini_available ? 'Active & Configured' : 'Primary AI',
              },
              {
                id: 'huggingface' as ModelChoice,
                label: 'Hugging Face ViT',
                desc: modelStatus?.huggingface_available ? 'Configured' : 'Vision Transformer',
              },
            ].map((m) => {
              const active = preferredModel === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  id={`model-select-${m.id}`}
                  onClick={() => {
                    setPreferredModel(m.id);
                    if (currentAssessment?.image_reference) {
                      handleRunScan(currentAssessment.image_reference, currentAssessment.commodity, m.id);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-[8px] text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#2F5233] text-white border-[#2F5233] shadow-xs'
                      : 'bg-white text-[#1C2321] border-[#DDD9CD] hover:border-[#2F5233]'
                  }`}
                >
                  <span>{m.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      active ? 'bg-white/20 text-white' : 'bg-[#EFEDE6] text-[#5B6660]'
                    }`}
                  >
                    {m.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Image URL Form */}
        <form onSubmit={handleUrlSubmit} className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5B6660]" />
            <input
              type="url"
              placeholder="Or paste direct image URL (https://...)"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#DDD9CD] rounded-[8px] focus:outline-none focus:border-[#2F5233] text-[#1C2321]"
            />
          </div>
          <button
            type="submit"
            disabled={!inputUrl.trim() || analyzing}
            className="px-3 py-1.5 bg-[#EFEDE6] hover:bg-[#DDD9CD] text-[#1C2321] text-xs font-semibold rounded-[8px] border border-[#DDD9CD] transition-colors disabled:opacity-50"
          >
            Analyze URL
          </button>
        </form>

        {/* Test produce crate cards and Non-Produce validation test */}
        <div className="pt-2">
          <div className="text-xs font-semibold text-[#1C2321] mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers size={14} className="text-[#2F5233]" />
              <span>Select Ready Test Produce or Run Validation Checks:</span>
            </div>
            <span className="text-[11px] text-[#5B6660]">
              9 test cultivars + 1 non-produce validation benchmark
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {/* Non-Produce / Selfie Negative Test Sample */}
            <button
              type="button"
              id="sample-selfie-negative-test"
              onClick={() => {
                setCustomImageUrl(SAMPLE_SELFIE_URL);
                handleRunScan(SAMPLE_SELFIE_URL, 'Person Portrait (Selfie Test)');
              }}
              className={`text-left p-2 rounded-[12px] border transition-all ${
                customImageUrl === SAMPLE_SELFIE_URL
                  ? 'border-[#B3412C] bg-[#FBEBE8] ring-1 ring-[#B3412C] shadow-xs'
                  : 'border-[#DDD9CD] bg-[#FDFBF7] hover:bg-[#FBEBE8]/40'
              }`}
            >
              <div className="aspect-4/3 w-full rounded-[6px] overflow-hidden mb-1.5 bg-[#EFEDE6] relative">
                <img
                  src={SAMPLE_SELFIE_URL}
                  alt="Selfie / Portrait Test"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-[4px] bg-[#B3412C] text-white text-[9px] font-bold">
                  Selfie / Non-Produce
                </span>
              </div>
              <div className="font-semibold text-xs text-[#B3412C] truncate" title="Selfie / Portrait Test">
                Selfie / Portrait Test
              </div>
              <div className="text-[10px] text-[#5B6660] flex items-center justify-between mt-1">
                <span className="font-bold text-[#B3412C]">Negative Test</span>
                <span className="font-mono text-[#5B6660]">Rejection Test</span>
              </div>
            </button>

            {/* Standard crop samples */}
            {SAMPLE_PRODUCE_IMAGES.map((sample) => {
              const isSelected = selectedSample.id === sample.id && !customImageUrl;
              return (
                <button
                  key={sample.id}
                  type="button"
                  id={`sample-produce-${sample.id}`}
                  onClick={() => {
                    setCustomImageUrl('');
                    setSelectedSample(sample);
                    handleRunScan(sample.image_url, sample.commodity);
                  }}
                  className={`text-left p-2 rounded-[12px] border transition-all ${
                    isSelected
                      ? 'border-[#2F5233] bg-[#E4ECE0]/40 ring-1 ring-[#2F5233] shadow-xs'
                      : 'border-[#DDD9CD] bg-white hover:bg-[#EFEDE6]/60'
                  }`}
                >
                  <div className="aspect-4/3 w-full rounded-[6px] overflow-hidden mb-1.5 bg-[#EFEDE6] relative">
                    <img
                      src={sample.image_url}
                      alt={sample.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-[4px] bg-black/70 text-white text-[9px] font-bold">
                      {sample.category}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-[#1C2321] truncate" title={sample.name}>
                    {sample.name}
                  </div>
                  <div className="text-[10px] text-[#5B6660] flex items-center justify-between mt-1">
                    <span className="font-bold text-[#2F5233]">{sample.expected_grade}</span>
                    <span className="font-mono">{sample.expected_confidence}% conf</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assessment Output Card */}
      <div id="cv-assessment-output" className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#DDD9CD]">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${
                isRejectedNonProduce ? 'bg-[#FBEBE8] text-[#B3412C]' : 'bg-[#E4ECE0] text-[#2F5233]'
              }`}
            >
              {isRejectedNonProduce ? <AlertOctagon size={16} /> : <Sparkles size={16} />}
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-[#1C2321]">
                {isRejectedNonProduce
                  ? 'Agricultural Produce Validation Status'
                  : 'Produce Recognition & Quality Certification'}
              </h2>
              {currentAssessment?.model_source && (
                <div className="text-[11px] text-[#5B6660] flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      isRejectedNonProduce ? 'bg-[#B3412C]' : 'bg-[#2F5233]'
                    }`}
                  />
                  <span>
                    Analyzed via: <strong>{currentAssessment.model_source}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs text-[#5B6660]">Verification Status:</span>
            {currentAssessment ? (
              <StatusBadge status={currentAssessment.assessment_status} size="sm" />
            ) : (
              <span className="text-xs text-[#5B6660]">Ready to scan</span>
            )}
          </div>
        </div>

        {analyzing ? (
          <div className="py-14 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 border-4 border-[#2F5233]/20 border-t-[#2F5233] rounded-full animate-spin" />
              <Eye size={20} className="absolute inset-0 m-auto text-[#2F5233] animate-pulse" />
            </div>
            <div>
              <div className="font-display font-bold text-base text-[#1C2321]">
                Running Multimodal Vision Inspection...
              </div>
              <p className="text-xs text-[#5B6660] mt-1 max-w-md mx-auto">
                Inspecting image content for agricultural produce vs. human portraits / selfies or objects, classifying crop taxonomy, and verifying Mandi grade standards.
              </p>
            </div>
          </div>
        ) : currentAssessment ? (
          isRejectedNonProduce ? (
            /* ================= NON-PRODUCE / SELFIE REJECTION VIEW ================= */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image Preview with Rejection Overlay */}
              <div className="space-y-3">
                <div className="relative aspect-square w-full rounded-[14px] overflow-hidden border-2 border-[#B3412C]/40 bg-[#EFEDE6] group">
                  <img
                    src={currentAssessment.image_reference}
                    alt={currentAssessment.subject_type || 'Non-Produce Upload'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {/* Red Rejection Badge */}
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-[6px] bg-[#B3412C] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                    <UserX size={12} />
                    <span>{currentAssessment.subject_type || 'Non-Produce Subject'}</span>
                  </div>

                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-[4px] bg-black/80 text-[10px] text-white font-mono">
                    Subject Detected
                  </div>
                </div>

                <div className="p-3 bg-[#FBEBE8]/60 rounded-[10px] border border-[#B3412C]/20 space-y-1">
                  <div className="text-[11px] text-[#5B6660] flex items-center justify-between font-mono">
                    <span>Audit ID:</span>
                    <span className="font-semibold text-[#1C2321]">{currentAssessment.id.slice(0, 16)}</span>
                  </div>
                  <div className="text-[11px] text-[#5B6660] flex items-center justify-between font-mono">
                    <span>Classification:</span>
                    <span className="font-bold text-[#B3412C]">NON_AGRICULTURAL</span>
                  </div>
                </div>

                <button
                  type="button"
                  id="reupload-produce-action-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 bg-[#2F5233] hover:bg-[#25401F] text-white text-xs font-bold rounded-[8px] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Upload size={14} />
                  <span>Upload Actual Crop / Produce Photo</span>
                </button>
              </div>

              {/* Rejection Details & Regulatory Explanation */}
              <div className="lg:col-span-2 space-y-4">
                {/* Rejection Banner */}
                <div className="p-4 rounded-[12px] bg-[#FBEBE8] border border-[#B3412C]/30 space-y-2">
                  <div className="flex items-center gap-2 text-[#B3412C]">
                    <ShieldAlert size={20} />
                    <span className="font-display font-extrabold text-base">
                      Non-Agricultural Subject Detected ({currentAssessment.subject_type || 'Human Portrait / Selfie'})
                    </span>
                  </div>
                  <p className="text-xs text-[#1C2321] leading-relaxed">
                    {currentAssessment.rejection_reason ||
                      'The uploaded photograph does not contain fresh agricultural produce. Mandi quality inspection requires photographs of harvested fruits, vegetables, tubers, grains, or farm crops.'}
                  </p>
                </div>

                {/* Regulatory Agmark Notice */}
                <div className="p-4 rounded-[12px] bg-[#F7F6F2] border border-[#DDD9CD] space-y-3">
                  <div className="text-xs font-bold text-[#1C2321] flex items-center gap-1.5">
                    <AlertTriangle size={15} className="text-[#C77B2E]" />
                    <span>APMC Mandi Quality Standards & Procurement Policy (§7 & §24.12):</span>
                  </div>
                  <ul className="text-xs text-[#5B6660] space-y-1.5 list-disc pl-5">
                    <li>
                      <strong>Produce-Only Mandate:</strong> Only genuine harvested agricultural crops (such as tomatoes, onions, capsicum, potatoes, chillies, mangoes) can receive an Agmark Grade certification (Grade A, B, or C).
                    </li>
                    <li>
                      <strong>No Commercial Contract Allocation:</strong> Non-produce photos, personal selfies, pets, or household objects cannot be attached to buyer demands or procurement orders.
                    </li>
                    <li>
                      <strong>Accurate Vision Pre-Screening:</strong> The vision pipeline utilizes multimodal spatial classification to inspect image contents before initiating grading parameters.
                    </li>
                  </ul>
                </div>

                {/* Candidate Observations */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#1C2321]">
                    Automated Vision Diagnostic Findings:
                  </div>
                  <div className="space-y-1.5">
                    {currentAssessment.detected_issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-[8px] bg-white border border-[#B3412C]/20 text-xs text-[#1C2321] flex items-center gap-2"
                      >
                        <UserX size={14} className="text-[#B3412C] shrink-0" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Action to Select Produce */}
                <div className="pt-2 border-t border-[#DDD9CD] flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-[#5B6660]">
                    Want to test produce grading? Select any verified sample crate above.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomImageUrl('');
                      setSelectedSample(SAMPLE_PRODUCE_IMAGES[0]);
                      handleRunScan(SAMPLE_PRODUCE_IMAGES[0].image_url, SAMPLE_PRODUCE_IMAGES[0].commodity);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E4ECE0] hover:bg-[#D3E2CD] text-[#2F5233] text-xs font-bold rounded-[8px] transition-colors"
                  >
                    <span>Test Hybrid Roma Tomatoes</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ================= VALID PRODUCE QUALITY CERTIFICATION VIEW ================= */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image Preview with Scan HUD */}
              <div className="space-y-3">
                <div className="relative aspect-square w-full rounded-[14px] overflow-hidden border border-[#DDD9CD] bg-[#EFEDE6] group">
                  <img
                    src={currentAssessment.image_reference}
                    alt={currentAssessment.recognized_produce || 'Produce'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {/* Overlaid Botanical Pill */}
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-[6px] bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                    <Tag size={12} className="text-[#8FB339]" />
                    <span>{currentAssessment.recognized_produce || currentAssessment.commodity}</span>
                  </div>

                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-[4px] bg-black/75 text-[10px] text-white font-mono">
                    {currentAssessment.confidence}% Match
                  </div>
                </div>

                <div className="p-3 bg-[#F7F6F2] rounded-[10px] border border-[#DDD9CD] space-y-1">
                  <div className="text-[11px] text-[#5B6660] flex items-center justify-between font-mono">
                    <span>Certificate ID:</span>
                    <span className="font-semibold text-[#1C2321]">{currentAssessment.id.slice(0, 16)}</span>
                  </div>
                  <div className="text-[11px] text-[#5B6660] flex items-center justify-between font-mono">
                    <span>Timestamp:</span>
                    <span>
                      {new Date(currentAssessment.analyzed_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Re-analyze button */}
                <button
                  type="button"
                  id="rescan-current-produce-btn"
                  onClick={() =>
                    handleRunScan(currentAssessment.image_reference, currentAssessment.commodity, preferredModel)
                  }
                  className="w-full py-2 bg-white hover:bg-[#EFEDE6] text-[#1C2321] text-xs font-semibold rounded-[8px] border border-[#DDD9CD] transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw size={13} />
                  <span>Re-Scan with Vision Engine</span>
                </button>
              </div>

              {/* Assessment Details & Recognition Metrics */}
              <div className="lg:col-span-2 space-y-4">
                {/* Highlight Box: Recognized Crop Name & Category */}
                <div className="p-4 rounded-[12px] bg-[#E4ECE0]/50 border border-[#2F5233]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#2F5233]">
                      Automated Produce Identification:
                    </div>
                    <div className="font-display font-black text-xl text-[#1C2321] mt-0.5 flex items-center gap-2">
                      <span>{currentAssessment.recognized_produce || currentAssessment.commodity}</span>
                      {currentAssessment.produce_category && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2F5233] text-white uppercase tracking-wider">
                          {currentAssessment.produce_category}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#5B6660] mt-1">
                      Commodity Allocation: <strong>{currentAssessment.commodity}</strong> • Ripeness:{' '}
                      {currentAssessment.ripeness_stage || 'Market Fresh'}
                    </div>
                  </div>

                  <div className="shrink-0 text-right sm:border-l sm:border-[#2F5233]/20 sm:pl-4">
                    <div className="text-[11px] text-[#5B6660] font-medium">CV Match Confidence</div>
                    <div className="font-display font-extrabold text-2xl text-[#2F5233] font-mono">
                      {currentAssessment.confidence}%
                    </div>
                  </div>
                </div>

                {/* Low confidence warning banner (§7) */}
                {currentAssessment.confidence < 75 ? (
                  <div className="p-3.5 rounded-[10px] bg-[#FEF5E7] border border-[#B8860B]/40 text-[#B8860B] flex items-start gap-2.5">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    <div className="text-xs space-y-0.5">
                      <span className="font-bold">Manual Physical Verification Required (§7)</span>
                      <p className="text-[#5B6660]">
                        Optical confidence ({currentAssessment.confidence}%) is below 75% threshold due to shadows or crate occlusions. Physical inspection mandated at farmgate pickup.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-[10px] bg-[#E4ECE0] border border-[#2F5233]/20 text-[#2F5233] flex items-center gap-2 text-xs font-semibold">
                    <CheckCircle2 size={16} />
                    <span>Optical Certification Verified: Passed automated computer vision quality thresholds.</span>
                  </div>
                )}

                {/* Four Key Mandi Grading Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-[10px] bg-[#EFEDE6] border border-[#DDD9CD]">
                    <div className="text-[11px] text-[#5B6660] font-medium">Estimated Grade</div>
                    <div className="font-display font-extrabold text-xl text-[#1C2321] mt-1">
                      {currentAssessment.estimated_grade}
                    </div>
                  </div>

                  <div className="p-3 rounded-[10px] bg-[#EFEDE6] border border-[#DDD9CD]">
                    <div className="text-[11px] text-[#5B6660] font-medium">Blemish Ratio</div>
                    <div className="font-display font-bold text-base text-[#C77B2E] mt-1 font-mono">
                      {currentAssessment.details?.blemishes_percent}%
                    </div>
                  </div>

                  <div className="p-3 rounded-[10px] bg-[#EFEDE6] border border-[#DDD9CD]">
                    <div className="text-[11px] text-[#5B6660] font-medium">Color Uniformity</div>
                    <div className="font-display font-bold text-base text-[#1C2321] mt-1">
                      {currentAssessment.details?.color_uniformity}
                    </div>
                  </div>

                  <div className="p-3 rounded-[10px] bg-[#EFEDE6] border border-[#DDD9CD]">
                    <div className="text-[11px] text-[#5B6660] font-medium">Shelf Life Est.</div>
                    <div className="font-display font-bold text-base text-[#2F5233] mt-1">
                      {currentAssessment.details?.recommended_shelf_life}
                    </div>
                  </div>
                </div>

                {/* Top Predictions Multi-Class Probability Bar (if available) */}
                {currentAssessment.top_predictions && currentAssessment.top_predictions.length > 0 && (
                  <div className="p-3 rounded-[10px] bg-[#F7F6F2] border border-[#DDD9CD] space-y-2">
                    <div className="text-xs font-semibold text-[#1C2321] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <BarChart3 size={13} className="text-[#2F5233]" />
                        <span>CV Classification Candidates & Probability Distribution:</span>
                      </span>
                      <span className="text-[10px] text-[#5B6660] font-mono">Softmax Scores</span>
                    </div>

                    <div className="space-y-1.5">
                      {currentAssessment.top_predictions.map((pred, i) => (
                        <div key={i} className="space-y-0.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[#1C2321] font-medium">{pred.label}</span>
                            <span className="font-mono text-[#5B6660]">{Math.round(pred.score * 100)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#DDD9CD] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${i === 0 ? 'bg-[#2F5233]' : 'bg-[#C77B2E]/70'}`}
                              style={{ width: `${Math.min(100, Math.round(pred.score * 100))}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detected Optical Characteristics & Defects */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#1C2321]">
                    Visible Produce Characteristics & Defects Detected:
                  </div>
                  <div className="space-y-1.5">
                    {currentAssessment.detected_issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-[8px] bg-white border border-[#DDD9CD] text-xs text-[#1C2321] flex items-center gap-2"
                      >
                        <Check size={14} className="text-[#2F5233] shrink-0" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regulatory Disclaimer */}
                <div className="pt-2 text-[11px] text-[#5B6660] flex items-start gap-1.5 border-t border-[#DDD9CD]">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <span>
                    Regulatory notice (§7 & §24.12): Automated computer vision outputs provide procurement decision support; physical inspection and final grade certification occur upon warehouse arrival.
                  </span>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="py-10 text-center text-xs text-[#5B6660] space-y-1">
            <p className="font-semibold text-sm text-[#1C2321]">No Produce Scanned Yet</p>
            <p>Select any test produce sample above or upload a farm photo to run the computer vision classifier.</p>
          </div>
        )}
      </div>
    </div>
  );
};
