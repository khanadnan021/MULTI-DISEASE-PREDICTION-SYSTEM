import React from 'react';

interface RiskGaugeMeterProps {
  score: number; // 0 to 100
  riskLevel: string;
}

export const RiskGaugeMeter: React.FC<RiskGaugeMeterProps> = ({ score, riskLevel }) => {
  const clampedScore = Math.min(100, Math.max(0, score));

  // Needle angle: from -90 deg (0%) to +90 deg (100%)
  const needleAngle = -90 + (clampedScore / 100) * 180;

  // Arc path geometry
  const cx = 130;
  const cy = 130;
  const r = 90;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const isHigh = clampedScore >= 70;
  const isModerate = clampedScore >= 40 && clampedScore < 70;

  return (
    <div className="flex flex-col items-center justify-between p-4 sm:p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
      <div className="w-full flex items-center justify-between pb-2 mb-1 border-b border-[#E2E8F0]">
        <div>
          <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
            Risk Stratification
          </span>
          <h4 className="text-xs font-bold text-[#172033]">
            Calibrated Risk Probability Index
          </h4>
        </div>
        <span className="text-[10px] text-[#64748B] font-mono">
          Threshold: 50%
        </span>
      </div>

      <div className="relative w-64 h-36 flex items-end justify-center overflow-hidden my-2">
        <svg viewBox="0 0 260 145" className="w-full h-full overflow-visible">
          {/* Segment 1: Low Risk (0% - 40%) -> -90 deg to -18 deg */}
          <path
            d={describeArc(cx, cy, r, -90, -18)}
            fill="none"
            stroke="#16A34A"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Segment 2: Moderate Risk (40% - 70%) -> -18 deg to +36 deg */}
          <path
            d={describeArc(cx, cy, r, -18, 36)}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="14"
          />

          {/* Segment 3: High Risk (70% - 100%) -> +36 deg to +90 deg */}
          <path
            d={describeArc(cx, cy, r, 36, 90)}
            fill="none"
            stroke="#EF4444"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Reference Interval Tick Marks */}
          {[-90, -54, -18, 18, 54, 90].map((deg, i) => {
            const p1 = polarToCartesian(cx, cy, r - 12, deg);
            const p2 = polarToCartesian(cx, cy, r + 12, deg);
            return (
              <line
                key={i}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="#cbd5e1"
                strokeWidth="2"
              />
            );
          })}

          {/* Central Needle Pivot */}
          <g transform={`rotate(${needleAngle}, ${cx}, ${cy})`}>
            {/* Needle Body */}
            <polygon
              points={`${cx - 3},${cy} ${cx + 3},${cy} ${cx},${cy - r + 8}`}
              fill="#1e293b"
            />
          </g>

          {/* Pivot Circle */}
          <circle cx={cx} cy={cy} r="6" fill="#1e293b" />
          <circle cx={cx} cy={cy} r="2.5" fill="#ffffff" />

          {/* Percentage Labels on Scale */}
          <text x="32" y="138" className="text-[10px] font-mono fill-slate-500" textAnchor="middle">
            0%
          </text>
          <text x="100" y="44" className="text-[10px] font-mono fill-slate-500" textAnchor="middle">
            40%
          </text>
          <text x="160" y="44" className="text-[10px] font-mono fill-slate-500" textAnchor="middle">
            70%
          </text>
          <text x="228" y="138" className="text-[10px] font-mono fill-slate-500" textAnchor="middle">
            100%
          </text>
        </svg>
      </div>

      {/* Score & Classification Chip */}
      <div className="w-full flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-[#64748B] font-medium">Risk Score:</span>
          <span className="text-base font-bold font-mono text-[#172033]">
            {clampedScore.toFixed(1)}%
          </span>
        </div>

        <div
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
            isHigh
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : isModerate
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-[#DCFCE7] text-[#166534] border-emerald-300'
          }`}
        >
          {riskLevel}
        </div>
      </div>
    </div>
  );
};
