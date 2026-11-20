"use client";

import type { CSSProperties } from "react";

type YBLoadingLogoProps = {
  size?: number;
  label?: string;
  className?: string;
  /** Hide the built-in status region when an enclosing loader already owns one. */
  decorative?: boolean;
};

/**
 * Lightweight YB logo loader. It draws the monogram as SVG strokes and then
 * reveals its circuit nodes. No additional animation dependency is required.
 * Place in an existing loading boundary; do not add an artificial page delay.
 */
export default function YBLoadingLogo({
  size = 156,
  label = "Loading portfolio",
  className,
  decorative = false,
}: YBLoadingLogoProps) {
  const style = { "--yb-size": `${size}px` } as CSSProperties;

  return (
    <div
      className={["yb-loader", className].filter(Boolean).join(" ")}
      style={style}
      role={decorative ? undefined : "status"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
    >
      <svg
        className="yb-loader__mark"
        width={size}
        height={size}
        viewBox="0 0 1024 1024"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="yb-loader-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F5FAFF" />
            <stop offset="0.32" stopColor="#A9C8D8" />
            <stop offset="0.7" stopColor="#52758B" />
            <stop offset="1" stopColor="#28495D" />
          </linearGradient>
          <linearGradient id="yb-loader-cyan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8AF7FF" />
            <stop offset="0.36" stopColor="#22D3EE" />
            <stop offset="0.72" stopColor="#087BD8" />
            <stop offset="1" stopColor="#164AA8" />
          </linearGradient>
          <filter id="yb-loader-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.03 0 0 0 0 0.70 0 0 0 0 0.95 0 0 0 .45 0"
              result="cyanBlur"
            />
            <feMerge>
              <feMergeNode in="cyanBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Y: left arms and stem */}
        <g filter="url(#yb-loader-glow)" strokeLinecap="square" strokeLinejoin="bevel">
          <path
            className="yb-draw yb-draw--1"
            pathLength={1}
            d="M206 218 L365 377 L524 218"
            stroke="url(#yb-loader-cyan)"
            strokeWidth="83"
          />
          <path
            className="yb-draw yb-draw--2"
            pathLength={1}
            d="M365 377 V775"
            stroke="url(#yb-loader-cyan)"
            strokeWidth="83"
          />
        </g>

        {/* B: vertical stem and two bowls */}
        <g filter="url(#yb-loader-glow)" strokeLinecap="square" strokeLinejoin="round">
          <path
            className="yb-draw yb-draw--3"
            pathLength={1}
            d="M500 218 V775"
            stroke="url(#yb-loader-metal)"
            strokeWidth="82"
          />
          <path
            className="yb-draw yb-draw--4"
            pathLength={1}
            d="M500 218 H667 C826 218 826 410 667 410 H500"
            stroke="url(#yb-loader-metal)"
            strokeWidth="82"
          />
          <path
            className="yb-draw yb-draw--5"
            pathLength={1}
            d="M500 410 H694 C858 410 858 775 694 775 H500"
            stroke="url(#yb-loader-cyan)"
            strokeWidth="82"
          />
        </g>

        {/* Circuit traces appear after the monogram is drawn. */}
        <g
          stroke="#23DDF3"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path className="yb-draw yb-draw--6" pathLength={1} d="M600 317 H686 L718 286 H755" />
          <path className="yb-draw yb-draw--7" pathLength={1} d="M594 552 H660 L696 588 H752" />
          <path className="yb-draw yb-draw--8" pathLength={1} d="M596 674 H672 L702 644 H756" />
          <path
            className="yb-draw yb-draw--9"
            pathLength={1}
            d="M626 470 L676 445 L727 470 L676 511 Z M626 470 H727 M676 445 V511"
          />
        </g>

        <g className="yb-loader__nodes" fill="#A5F8FF" stroke="#087BC4" strokeWidth="7">
          <circle cx="755" cy="286" r="14" />
          <circle cx="752" cy="552" r="14" />
          <circle cx="756" cy="644" r="14" />
          <circle cx="626" cy="470" r="11" />
          <circle cx="676" cy="445" r="11" />
          <circle cx="727" cy="470" r="11" />
          <circle cx="676" cy="511" r="11" />
          <circle cx="676" cy="470" r="12" />
        </g>
      </svg>

      {decorative ? null : <span className="yb-loader__label">{label}</span>}

      <style jsx>{`
        .yb-loader {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #9aa3aa;
          font-family: inherit;
        }
        .yb-loader__mark {
          display: block;
          width: var(--yb-size);
          height: var(--yb-size);
          overflow: visible;
        }
        .yb-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: yb-draw 1.35s cubic-bezier(0.55, 0.08, 0.25, 1) forwards;
        }
        .yb-draw--1 {
          animation-delay: 0.04s;
        }
        .yb-draw--2 {
          animation-delay: 0.25s;
        }
        .yb-draw--3 {
          animation-delay: 0.42s;
        }
        .yb-draw--4 {
          animation-delay: 0.6s;
        }
        .yb-draw--5 {
          animation-delay: 0.82s;
        }
        .yb-draw--6 {
          animation-delay: 1.05s;
        }
        .yb-draw--7 {
          animation-delay: 1.12s;
        }
        .yb-draw--8 {
          animation-delay: 1.19s;
        }
        .yb-draw--9 {
          animation-delay: 1.24s;
        }
        .yb-loader__nodes circle {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          animation: yb-node-in 0.32s ease-out forwards;
          animation-delay: 1.42s;
        }
        .yb-loader__label {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          animation: yb-label-in 0.5s ease-out 0.3s both;
        }
        @keyframes yb-draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes yb-node-in {
          from {
            opacity: 0;
            transform: scale(0.45);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes yb-label-in {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .yb-draw {
            animation: none;
            stroke-dashoffset: 0;
          }
          .yb-loader__nodes circle {
            animation: none;
            opacity: 1;
          }
          .yb-loader__label {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
