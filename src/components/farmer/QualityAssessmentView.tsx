import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QualityAssessment } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SAMPLE_PRODUCE_IMAGES, SampleProduceImage } from '../../utils/qualityAssessment';
import {
  Sparkles,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  Layers,
  Info
} from 'lucide-react';

interface QualityAssessmentViewProps {
  onAssessmentCompleted?: (assessment: QualityAssessment) => void;
}

export const QualityAssessmentView: React.FC<QualityAssessmentViewProps> = ({
  onAssessmentCompleted,
}) => {
  const { runQualityAssessment, currentUser, qualityAssessments } = useApp();

  const [selectedSample, setSelectedSample] = useState<SampleProduceImage>(SAMPLE_PRODUCE_IMAGES[0]);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<QualityAssessment | null>(
    qualityAssessments[`qa-${currentUser.id}`] || null
  );

  const handleRunScan = async (imgUrl: string, commodity: string) => {
    setAnalyzing(true);
    try {
      const assessment = await runQualityAssessment(imgUrl, commodity, currentUser.id);
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
        handleRunScan(dataUrl, 'Tomatoes');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="quality-assessment-studio" className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDD9CD]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-[#1C2321]">
                Produce Quality Assessment
              </span>
              <span className="px-2 py-0.5 rounded-[6px] bg-[#F6E7D3] text-[#C77B2E] border border-[#C77B2E]/30 text-xs font-semibold">
                Prototype AI (§22)
              </span>
            </div>
            <p className="text-xs text-[#5B6660] mt-0.5">
              Preliminary computer vision analysis. Decision support only — not a guarantee of physical grade (§7, §24.12).
            </p>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-[#2F5233] hover:bg-[#25401F] text-white text-xs font-semibold rounded-[10px] transition-colors shadow-sm self-start sm:self-center">
            <Camera size={16} />
            <span>Upload Produce Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Sample selection pills for immediate testing */}
        <div className="pt-3">
          <div className="text-xs font-semibold text-[#1C2321] mb-2 flex items-center gap-1.5">
            <Layers size={14} className="text-[#2F5233]" />
            <span>Select Test Produce Crate or Upload Custom Image:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SAMPLE_PRODUCE_IMAGES.map((sample) => {
              const isSelected = selectedSample.id === sample.id && !customImageUrl;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => {
                    setCustomImageUrl('');
                    setSelectedSample(sample);
                    handleRunScan(sample.image_url, sample.commodity);
                  }}
                  className={`text-left p-2.5 rounded-[12px] border transition-all ${
                    isSelected
                      ? 'border-[#2F5233] bg-[#E4ECE0]/30 shadow-sm'
                      : 'border-[#DDD9CD] bg-white hover:bg-[#EFEDE6]/60'
                  }`}
                >
                  <div className="aspect-video w-full rounded-[8px] overflow-hidden mb-2 bg-[#EFEDE6]">
                    <img
                      src={sample.image_url}
                      alt={sample.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="font-semibold text-xs text-[#1C2321] truncate">
                    {sample.name}
                  </div>
                  <div className="text-[11px] text-[#5B6660] flex items-center justify-between mt-1">
                    <span>{sample.expected_grade}</span>
                    <span className="font-mono">{sample.expected_confidence}% conf</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assessment Output Card (§7) */}
      <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-base text-[#1C2321] flex items-center gap-2">
            <Sparkles size={16} className="text-[#C77B2E]" />
            <span>Computer Vision Assessment Result</span>
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5B6660]">Status:</span>
            {currentAssessment ? (
              <StatusBadge status={currentAssessment.assessment_status} size="sm" />
            ) : (
              <span className="text-xs text-[#5B6660]">Ready to scan</span>
            )}
          </div>
        </div>

        {analyzing ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#2F5233] border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="font-semibold text-sm text-[#1C2321]">
              Running Prototype CV Inference Pipeline...
            </div>
            <p className="text-xs text-[#5B6660]">
              Analyzing chromatic uniformity, skin surface scars, and crate packing density
            </p>
          </div>
        ) : currentAssessment ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image Preview */}
            <div className="space-y-2">
              <div className="aspect-square w-full rounded-[12px] overflow-hidden border border-[#DDD9CD] bg-[#EFEDE6]">
                <img
                  src={currentAssessment.image_reference}
                  alt="Assessed produce"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-[11px] text-[#5B6660] font-mono text-center">
                Ref ID: {currentAssessment.id}
              </div>
            </div>

            {/* Metric Callouts */}
            <div className="md:col-span-2 space-y-4">
              {/* Low confidence banner (§7) */}
              {currentAssessment.confidence < 75 ? (
                <div className="p-3.5 rounded-[10px] bg-[#FEF5E7] border border-[#B8860B]/40 text-[#B8860B] flex items-start gap-2.5">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold">Manual Verification Required (§7)</span>
                    <p className="text-[#5B6660]">
                      Image confidence ({currentAssessment.confidence}%) is below 75% threshold due to shadows or crate obscuration. Physical verification required at farmgate loading.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-[10px] bg-[#E4ECE0] border border-[#2F5233]/20 text-[#2F5233] flex items-center gap-2 text-xs font-semibold">
                  <CheckCircle2 size={16} />
                  <span>Preliminary Grade Verified (Confidence score passes automated threshold)</span>
                </div>
              )}

              {/* Grade & Confidence Display */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-[10px] bg-[#EFEDE6] border border-[#DDD9CD]">
                  <div className="text-[11px] text-[#5B6660] font-medium">Estimated Grade</div>
                  <div className="font-display font-extrabold text-xl text-[#1C2321] mt-1">
                    {currentAssessment.estimated_grade}
                  </div>
                </div>

                <div className="p-3 rounded-[10px] bg-[#EFEDE6] border border-[#DDD9CD]">
                  <div className="text-[11px] text-[#5B6660] font-medium">CV Confidence</div>
                  <div className="font-display font-extrabold text-xl text-[#C77B2E] mt-1 font-mono">
                    {currentAssessment.confidence}%
                  </div>
                </div>

                <div className="p-3 rounded-[10px] bg-[#EFEDE6] border border-[#DDD9CD]">
                  <div className="text-[11px] text-[#5B6660] font-medium">Blemish Index</div>
                  <div className="font-display font-bold text-base text-[#1C2321] mt-1 font-mono">
                    {currentAssessment.details?.blemishes_percent}%
                  </div>
                </div>

                <div className="p-3 rounded-[10px] bg-[#EFEDE6] border border-[#DDD9CD]">
                  <div className="text-[11px] text-[#5B6660] font-medium">Shelf Life Est.</div>
                  <div className="font-display font-bold text-base text-[#2F5233] mt-1">
                    {currentAssessment.details?.recommended_shelf_life}
                  </div>
                </div>
              </div>

              {/* Detected Issues */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#1C2321]">
                  Visible Produce Characteristics & Defects Detected:
                </div>
                <div className="space-y-1.5">
                  {currentAssessment.detected_issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-[6px] bg-white border border-[#DDD9CD] text-xs text-[#1C2321] flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2F5233]" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer (§7 & §24.12) */}
              <div className="pt-2 text-[11px] text-[#5B6660] flex items-center gap-1.5 border-t border-[#DDD9CD]">
                <Info size={13} className="shrink-0" />
                <span>
                  Regulatory notice: Prototype AI quality output provides procurement decision support only; final settlement is governed by physical delivery acceptance.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#5B6660]">
            Click any test produce sample or upload a photo to generate an automated computer vision assessment.
          </div>
        )}
      </div>
    </div>
  );
};
