import React from 'react';
import { QualityAssessmentView } from './QualityAssessmentView';
import { X, Sparkles } from 'lucide-react';
import { QualityAssessment } from '../../types';

interface QualityScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  commodity?: string;
  farmerId?: string;
  onAssessmentCompleted?: (assessment: QualityAssessment) => void;
}

export const QualityScanModal: React.FC<QualityScanModalProps> = ({
  isOpen,
  onClose,
  commodity,
  farmerId,
  onAssessmentCompleted,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-[20px] border border-[#DDD9CD] shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#DDD9CD] flex items-center justify-between bg-[#F7F6F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#E4ECE0] text-[#2F5233] flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-[#1C2321]">
                AI Optical Produce Quality Assessment
              </h2>
              <p className="text-xs text-[#5B6660]">
                Instant computer-vision grade certification (Grade A / B / C, defect ratio & pricing index)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5B6660] hover:text-[#1C2321] rounded-md hover:bg-[#DDD9CD]/50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <QualityAssessmentView
            commodity={commodity}
            farmerId={farmerId}
            onAssessmentCompleted={(assessment) => {
              if (onAssessmentCompleted) {
                onAssessmentCompleted(assessment);
              }
            }}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#DDD9CD] bg-[#F7F6F2] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-[10px] bg-[#2F5233] text-white text-xs font-bold hover:bg-[#25401F] transition-colors shadow-xs"
          >
            Done & Close
          </button>
        </div>
      </div>
    </div>
  );
};
