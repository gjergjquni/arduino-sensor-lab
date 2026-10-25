import type { Sensor } from '../../types/sensor'

export function WiringDiagram({ sensor }: { sensor: Sensor }) {
  const pins = sensor.pins.slice(0, 6)

  return (
    <div className="wiring-svg" role="img" aria-label={`Diagramë lidhjeje për ${sensor.name}`}>
      <svg viewBox="0 0 520 280" width="100%" height="auto">
        <defs>
          <linearGradient id="boardGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0d4a4d" />
            <stop offset="100%" stopColor="#062e30" />
          </linearGradient>
        </defs>
        <rect width="520" height="280" fill="url(#boardGrad)" />

        {/* Arduino */}
        <rect x="40" y="50" width="150" height="180" rx="10" fill="#00979D" />
        <text x="115" y="78" textAnchor="middle" fill="white" fontSize="13" fontFamily="Outfit, sans-serif" fontWeight="700">
          Arduino Uno
        </text>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <rect x="55" y={95 + i * 20} width="14" height="10" rx="2" fill="#fbbf24" />
            <text x="78" y={104 + i * 20} fill="white" fontSize="10" fontFamily="Source Sans 3, sans-serif">
              {['5V', 'GND', 'A0', 'D2', 'D9', 'D11'][i]}
            </text>
          </g>
        ))}

        {/* Module */}
        <rect x="330" y="70" width="150" height="140" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="405" y="98" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontFamily="Outfit, sans-serif" fontWeight="700">
          {sensor.code}
        </text>
        <text x="405" y="118" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Source Sans 3, sans-serif">
          Modul KY
        </text>

        {pins.map((p, i) => {
          const y = 140 + i * 16
          return (
            <g key={`${p.module}-${i}`}>
              <circle cx="345" cy={y} r="4" fill="#22d3ee" />
              <text x="358" y={y + 4} fill="#cbd5e1" fontSize="10" fontFamily="JetBrains Mono, monospace">
                {p.module} → {p.arduino.length > 22 ? `${p.arduino.slice(0, 22)}…` : p.arduino}
              </text>
              <path
                d={`M 190 ${110 + Math.min(i, 5) * 18} C 250 ${110 + Math.min(i, 5) * 18}, 280 ${y}, 341 ${y}`}
                fill="none"
                stroke={['#fbbf24', '#94a3b8', '#38bdf8', '#34d399', '#f472b6', '#a78bfa'][i % 6]}
                strokeWidth="2"
                opacity="0.85"
              />
            </g>
          )
        })}

        <text x="260" y="255" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Source Sans 3, sans-serif">
          Ilustrim skematik - ndiqni udhëzimin e saktë nga Excel
        </text>
      </svg>
    </div>
  )
}
