interface Props {
  name: string
  size?: number
}

export function SensorIcon({ name, size = 28 }: Props) {
  const s = size
  const common = {
    width: s,
    height: s,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (name) {
    case 'gamepad':
      return (
        <svg {...common}>
          <rect x="3" y="8" width="18" height="10" rx="3" />
          <path d="M8 13h2M9 12v2M15 12.5h.01M17.5 13.5h.01" />
        </svg>
      )
    case 'flame':
      return (
        <svg {...common}>
          <path d="M12 3c2 3 1 5 1 5s3-1 4 2 0 7-5 9c-5-2-6-6-5-9 1-3 3-4 5-7z" />
        </svg>
      )
    case 'lightbulb':
      return (
        <svg {...common}>
          <path d="M9 18h6M10 21h4" />
          <path d="M8 10a4 4 0 1 1 8 0c0 2-1.5 3-2.5 4H10.5C9.5 13 8 12 8 10z" />
        </svg>
      )
    case 'heart':
      return (
        <svg {...common}>
          <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" />
        </svg>
      )
    case 'tilt':
      return (
        <svg {...common}>
          <path d="M4 16l8-10 8 10" />
          <circle cx="12" cy="17" r="2" />
        </svg>
      )
    case 'magnet':
      return (
        <svg {...common}>
          <path d="M6 4v8a6 6 0 0 0 12 0V4" />
          <path d="M6 4h3v5H6zM15 4h3v5h-3z" />
        </svg>
      )
    case 'relay':
      return (
        <svg {...common}>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M8 10h8M8 14h5" />
        </svg>
      )
    case 'thermo':
      return (
        <svg {...common}>
          <path d="M10 14V5a2 2 0 1 1 4 0v9a3.5 3.5 0 1 1-4 0z" />
        </svg>
      )
    case 'mic':
      return (
        <svg {...common}>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
        </svg>
      )
    case 'touch':
      return (
        <svg {...common}>
          <path d="M9 11V5a2 2 0 1 1 4 0v8l4 2v4H8l-2-5 3-2z" />
        </svg>
      )
    case 'laser':
      return (
        <svg {...common}>
          <circle cx="7" cy="12" r="3" />
          <path d="M10 12h11M17 9l4 3-4 3" />
        </svg>
      )
    case 'shake':
      return (
        <svg {...common}>
          <path d="M4 8l3 8M8 6l3 12M12 5l3 14M16 7l3 10" />
        </svg>
      )
    case 'ir':
      return (
        <svg {...common}>
          <path d="M4 12h4M16 12h4" />
          <circle cx="12" cy="12" r="3" />
          <path d="M7 8a7 7 0 0 1 10 0M7 16a7 7 0 0 0 10 0" />
        </svg>
      )
    case 'eye':
      return (
        <svg {...common}>
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'speaker':
      return (
        <svg {...common}>
          <path d="M4 9v6h4l5 4V5L8 9H4z" />
          <path d="M16 9a3 3 0 0 1 0 6" />
        </svg>
      )
    case 'droplet':
      return (
        <svg {...common}>
          <path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z" />
        </svg>
      )
    case 'radar':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 12l6-4" />
        </svg>
      )
    case 'tap':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 5v2M12 17v2M5 12h2M17 12h2" />
        </svg>
      )
    case 'sun':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M5 19l1.5-1.5" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <rect x="5" y="5" width="14" height="14" rx="3" />
          <path d="M9 12h6M12 9v6" />
        </svg>
      )
  }
}

