import React from 'react';
import { DemandStatus, ApplicationStatus, LogisticsJobStatus } from '../../types';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  Lock, 
  XCircle, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Package
} from 'lucide-react';

type BadgeType = DemandStatus | ApplicationStatus | LogisticsJobStatus | 'LOCKED' | 'AVAILABLE' | 'PROTOTYPE_AI' | 'MANUAL_VERIFY' | 'RECOMMENDED';

interface StatusBadgeProps {
  status: BadgeType | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  let label = status.replace(/_/g, ' ').toLowerCase();
  label = label.charAt(0).toUpperCase() + label.slice(1);
  
  let bgStyle = 'bg-[#EFEDE6]';
  let textStyle = 'text-[#5B6660]';
  let borderStyle = 'border-[#DDD9CD]';
  let Icon = Clock;

  switch (status) {
    case 'OPEN':
      bgStyle = 'bg-[#E4ECE0]';
      textStyle = 'text-[#2F5233]';
      borderStyle = 'border-[#2F5233]/20';
      Icon = Clock;
      label = 'Response open';
      break;
    case 'RESPONSE_CLOSED':
      bgStyle = 'bg-[#F6E7D3]';
      textStyle = 'text-[#C77B2E]';
      borderStyle = 'border-[#C77B2E]/20';
      Icon = Sparkles;
      label = 'Response closed';
      break;
    case 'MATCHED':
    case 'RECOMMENDED':
      bgStyle = 'bg-[#E4ECE0]';
      textStyle = 'text-[#2F5233]';
      borderStyle = 'border-[#2F5233]/30';
      Icon = Sparkles;
      label = 'Match ready';
      break;
    case 'CONFIRMED':
    case 'SELECTED':
      bgStyle = 'bg-[#E4ECE0]';
      textStyle = 'text-[#2E7D4F]';
      borderStyle = 'border-[#2E7D4F]/30';
      Icon = CheckCircle2;
      label = 'Confirmed';
      break;
    case 'LOCKED':
      bgStyle = 'bg-[#F6E7D3]';
      textStyle = 'text-[#C77B2E]';
      borderStyle = 'border-[#C77B2E]/30';
      Icon = Lock;
      label = 'Locked';
      break;
    case 'AVAILABLE':
      bgStyle = 'bg-[#E4ECE0]';
      textStyle = 'text-[#2E7D4F]';
      borderStyle = 'border-[#2E7D4F]/30';
      Icon = CheckCircle2;
      label = 'Available';
      break;
    case 'APPLIED':
      bgStyle = 'bg-[#F7F6F2]';
      textStyle = 'text-[#3B6FA0]';
      borderStyle = 'border-[#3B6FA0]/30';
      Icon = Clock;
      label = 'Applied';
      break;
    case 'NOT_SELECTED':
      bgStyle = 'bg-[#EFEDE6]';
      textStyle = 'text-[#5B6660]';
      borderStyle = 'border-[#DDD9CD]';
      Icon = AlertCircle;
      label = 'Not selected';
      break;
    case 'IN_FULFILMENT':
    case 'IN_TRANSIT':
    case 'PICKUP_IN_PROGRESS':
    case 'ACCEPTED':
    case 'EN_ROUTE_PICKUP':
      bgStyle = 'bg-[#EBF3FA]';
      textStyle = 'text-[#3B6FA0]';
      borderStyle = 'border-[#3B6FA0]/30';
      Icon = Truck;
      label = status === 'IN_TRANSIT' ? 'In transit' : 'In fulfilment';
      break;
    case 'DELIVERED':
    case 'COMPLETED':
      bgStyle = 'bg-[#E4ECE0]';
      textStyle = 'text-[#2E7D4F]';
      borderStyle = 'border-[#2E7D4F]/30';
      Icon = ShieldCheck;
      label = 'Delivered';
      break;
    case 'UNFULFILLED':
    case 'REJECTED':
    case 'CANCELLED':
      bgStyle = 'bg-[#FBEBE8]';
      textStyle = 'text-[#B3412C]';
      borderStyle = 'border-[#B3412C]/30';
      Icon = XCircle;
      label = status === 'UNFULFILLED' ? 'Unfulfilled' : label;
      break;
    case 'REJECTED_NON_PRODUCE':
      bgStyle = 'bg-[#FBEBE8]';
      textStyle = 'text-[#B3412C]';
      borderStyle = 'border-[#B3412C]/40';
      Icon = XCircle;
      label = 'Rejected (Non-Produce)';
      break;
    case 'PROTOTYPE_AI':
      bgStyle = 'bg-[#F6E7D3]';
      textStyle = 'text-[#C77B2E]';
      borderStyle = 'border-[#C77B2E]/30';
      Icon = Sparkles;
      label = 'Prototype AI';
      break;
    case 'MANUAL_VERIFY':
    case 'MANUAL_VERIFICATION_REQUIRED':
      bgStyle = 'bg-[#FEF5E7]';
      textStyle = 'text-[#B8860B]';
      borderStyle = 'border-[#B8860B]/30';
      Icon = AlertCircle;
      label = 'Manual verification required';
      break;
    case 'FALLBACK_SELF_DELIVERY':
      bgStyle = 'bg-[#F6E7D3]';
      textStyle = 'text-[#C77B2E]';
      borderStyle = 'border-[#C77B2E]/30';
      Icon = Package;
      label = 'Direct/hub fallback';
      break;
    default:
      break;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-[13px]';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      id={`status-badge-${status.toLowerCase()}`}
      className={`inline-flex items-center gap-1.5 font-medium rounded-[6px] border ${padding} ${bgStyle} ${textStyle} ${borderStyle} whitespace-nowrap ${className}`}
    >
      <Icon size={iconSize} className="shrink-0" />
      <span>{label}</span>
    </span>
  );
};
