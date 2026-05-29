import React from 'react';

/**
 * High-Fidelity Vector SVG representation of the YR Digital Enterprise Logo.
 * Matches the uploaded golden crown, white intertwined gothic "YR" initials, and typography.
 * 
 * @param {Object} props
 * @param {string} props.variant - "compact" (just the crown + monogram YR) or "full" (full logo with texts)
 * @param {number} props.height - height of the logo SVG
 * @param {string} props.className - custom CSS classes
 */
export default function Logo({ variant = 'compact', height = 48, className = '' }) {
  const aspectRatio = variant === 'full' ? 1.0 : 1.0;
  const width = height * aspectRatio;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`yr-vector-logo ${className}`}
    >
      <defs>
        {/* Golden Metallic Linear Gradient for Crown and Subtitle */}
        <linearGradient id="yr-gold" x1="40" y1="20" x2="200" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="30%" stopColor="#F5B041" />
          <stop offset="70%" stopColor="#DC7633" />
          <stop offset="100%" stopColor="#873A5C" />
        </linearGradient>

        <linearGradient id="crown-glow" x1="120" y1="20" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5B041" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F5B041" stopOpacity="0" />
        </linearGradient>

        {/* Drop shadow filter for premium contrast */}
        <filter id="yr-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* ================= 1. GOLDEN CROWN GROUP ================= */}
      <g filter="url(#yr-shadow)">
        {/* Crown Peaks circles */}
        <circle cx="45" cy="58" r="4.5" fill="url(#yr-gold)" />
        <circle cx="85" cy="42" r="4.5" fill="url(#yr-gold)" />
        <circle cx="130" cy="26" r="6" fill="url(#yr-gold)" />
        <circle cx="175" cy="42" r="4.5" fill="url(#yr-gold)" />
        <circle cx="215" cy="58" r="4.5" fill="url(#yr-gold)" />

        {/* Crown Framework - Beautiful geometric intertwined arches */}
        <path
          d="M 45 92 L 45 58 L 81 82 L 85 42 L 124 74 L 130 26 L 136 74 L 175 42 L 179 82 L 215 58 L 215 92"
          fill="none"
          stroke="url(#yr-gold)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 45 92 L 130 55 L 215 92"
          fill="none"
          stroke="url(#yr-gold)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 85 76 L 130 42 L 175 76"
          fill="none"
          stroke="url(#yr-gold)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Crown bottom bar decoration */}
        <path
          d="M 65 92 L 195 92"
          fill="none"
          stroke="url(#yr-gold)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      {/* ================= 2. MONOGRAM "YR" INITIALS ================= */}
      <g filter="url(#yr-shadow)">
        {/* Curved Stylized White 'Y' */}
        <path
          d="M 55 110 C 65 140, 100 135, 110 110"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 50 110 C 45 155, 105 170, 95 210 L 60 210"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Curved Stylized White 'R' - intertwined with the 'Y' */}
        <path
          d="M 120 110 L 120 210"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 120 110 C 120 110, 205 105, 205 155 C 205 185, 145 180, 120 180"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 140 178 C 145 200, 175 210, 200 210"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinecap="round"
        />
      </g>

      {/* ================= 3. TEXT BRADING FOR FULL VARIANT ================= */}
      {variant === 'full' && (
        <g>
          {/* "YR Digital Enterprise" - White bold sans */}
          <text
            x="130"
            y="235"
            textAnchor="middle"
            fontFamily="'Outfit', sans-serif"
            fontSize="18"
            fontWeight="700"
            fill="#FFFFFF"
            letterSpacing="0.5"
          >
            YR Digital Enterprise
          </text>

          {/* "Designing & Printing" - Golden spaced caps */}
          <text
            x="130"
            y="252"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize="10"
            fontWeight="600"
            fill="url(#yr-gold)"
            letterSpacing="3"
          >
            DESIGNING & PRINTING
          </text>
        </g>
      )}
    </svg>
  );
}
