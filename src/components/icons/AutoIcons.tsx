import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// Sleek Percentage / Credit rate icon
export function IconCreditPercent({ className = "w-5 h-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="7.5" cy="7.5" r="3" />
      <circle cx="16.5" cy="16.5" r="3" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

// Precision Shield with Warranty Star
export function IconWarrantyShield({ className = "w-5 h-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6l-8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

// Car key & rapid handover icon
export function IconKeyHandover({ className = "w-5 h-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="8" cy="15" r="5" />
      <path d="M11.5 11.5L21 2" />
      <path d="M18 5l2 2" />
      <path d="M15 8l2 2" />
    </svg>
  );
}

// Automotive trade-in exchange icon
export function IconTradeInExchange({ className = "w-5 h-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 10h14l-4-4" />
      <path d="M17 14H3l4 4" />
    </svg>
  );
}

// Electronic Title Document (EPTS) with stamp
export function IconEptsDoc({ className = "w-5 h-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15h6" />
      <path d="M9 11h3" />
      <path d="M9 19h6" />
    </svg>
  );
}

// Gift / bonus package
export function IconGiftBonus({ className = "w-5 h-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

// Precision automotive chevron
export function IconArrowRight({ className = "w-4 h-4", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// Sleek Changan emblem silhouette
export function IconChanganEmblem({ className = "w-5 h-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
      <path
        d="M6.5 9.5C8 14 10 16.5 12 16.5C14 16.5 16 14 17.5 9.5"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// High-precision automotive alloy wheel & winter tire icon
export function IconWinterTire({ className = "w-6 h-6", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Outer tire circumference */}
      <circle cx="12" cy="12" r="10" strokeWidth="1.75" />
      {/* Inner rim perimeter */}
      <circle cx="12" cy="12" r="6" strokeWidth="1.5" />
      {/* Center wheel hub */}
      <circle cx="12" cy="12" r="2.2" strokeWidth="1.5" />
      {/* Rim spokes (5-spoke lightweight alloy design) */}
      <line x1="12" y1="6" x2="12" y2="9.8" strokeWidth="1.5" />
      <line x1="12" y1="14.2" x2="12" y2="18" strokeWidth="1.5" />
      <line x1="6.3" y1="10.2" x2="9.9" y2="11.3" strokeWidth="1.5" />
      <line x1="14.1" y1="12.7" x2="17.7" y2="13.8" strokeWidth="1.5" />
      <line x1="7.7" y1="16.3" x2="10.5" y2="13.9" strokeWidth="1.5" />
      <line x1="13.5" y1="10.1" x2="16.3" y2="7.7" strokeWidth="1.5" />
      {/* Outer tread sipes (subtle automotive grip notches) */}
      <line x1="12" y1="2" x2="12" y2="3.2" strokeWidth="1.5" />
      <line x1="19.1" y1="4.9" x2="18.2" y2="5.8" strokeWidth="1.5" />
      <line x1="22" y1="12" x2="20.8" y2="12" strokeWidth="1.5" />
      <line x1="19.1" y1="19.1" x2="18.2" y2="18.2" strokeWidth="1.5" />
      <line x1="12" y1="22" x2="12" y2="20.8" strokeWidth="1.5" />
      <line x1="4.9" y1="19.1" x2="5.8" y2="18.2" strokeWidth="1.5" />
      <line x1="2" y1="12" x2="3.2" y2="12" strokeWidth="1.5" />
      <line x1="4.9" y1="4.9" x2="5.8" y2="5.8" strokeWidth="1.5" />
    </svg>
  );
}

// Precision telemetry chronometer / lap timer icon
export function IconChronometer({ className = "w-5 h-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="13" r="8.5" />
      {/* Top crown pushers */}
      <line x1="12" y1="1.5" x2="12" y2="4.5" strokeWidth="2" />
      <line x1="10" y1="1.5" x2="14" y2="1.5" strokeWidth="2" />
      <line x1="18.5" y1="5.5" x2="17.2" y2="6.8" strokeWidth="1.8" />
      {/* Gauge hands */}
      <polyline points="12 9 12 13 15 13" strokeWidth="1.8" />
      {/* Tick markings */}
      <line x1="12" y1="6" x2="12" y2="7" strokeWidth="1.5" />
      <line x1="18" y1="13" x2="19" y2="13" strokeWidth="1.5" />
      <line x1="5" y1="13" x2="6" y2="13" strokeWidth="1.5" />
      <line x1="12" y1="19" x2="12" y2="20" strokeWidth="1.5" />
    </svg>
  );
}

// Official dealer verification seal
export function IconDealerSeal({ className = "w-5 h-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" strokeWidth="2" />
    </svg>
  );
}

// Dealer price parity / best offer icon
export function IconPriceMatch({ className = "w-5 h-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 3h5v5" />
      <path d="M21 3l-7 7" />
      <path d="M8 21H3v-5" />
      <path d="M3 21l7-7" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// Fair, transparent valuation & diagnostic balance
export function IconFairValuation({ className = "w-5 h-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3v18" />
      <path d="M6 7l6-3 6 3" />
      <path d="M6 7l-3 6h6l-3-6z" />
      <path d="M18 7l-3 6h6l-3-6z" />
      <path d="M4 21h16" />
    </svg>
  );
}

// Direct factory & dealer subsidy bonus
export function IconSubsidyBonus({ className = "w-5 h-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      <circle cx="12" cy="11.5" r="2.2" />
    </svg>
  );
}

// Sleek aerodynamic car silhouette
export function IconCarSilhouette({ className = "w-5 h-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3.5 13.5l2-4.5a3 3 0 0 1 2.7-1.8h7.6a3 3 0 0 1 2.7 1.8l2 4.5" />
      <path d="M2 13.5h20v3.5a1.5 1.5 0 0 1-1.5 1.5h-1.8a2.2 2.2 0 0 1-4.4 0H9.7a2.2 2.2 0 0 1-4.4 0H3.5A1.5 1.5 0 0 1 2 17v-3.5z" />
      <circle cx="7.5" cy="18.5" r="1.3" />
      <circle cx="16.5" cy="18.5" r="1.3" />
      <line x1="8.5" y1="7.2" x2="9.5" y2="12" />
      <line x1="15.5" y1="7.2" x2="14.5" y2="12" />
    </svg>
  );
}

// Precision verified check
export function IconCheckVerified({ className = "w-5 h-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="8 12 11 15 16 9" />
    </svg>
  );
}

// Concierge personal manager / 24/7 client care
export function IconConciergeSupport({ className = "w-5 h-5", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 11a9 9 0 0 1 18 0" />
      <path d="M21 11v6a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 11v6a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      <path d="M19 19a4 4 0 0 1-4 4h-2" />
    </svg>
  );
}


