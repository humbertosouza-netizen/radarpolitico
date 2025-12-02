import React from 'react'

interface RadarWidgetProps {
  title: string
  value: number | string
  max?: number
  unit?: string
  status?: 'active' | 'warning' | 'inactive'
  description?: string
}

export const RadarWidget: React.FC<RadarWidgetProps> = ({
  title,
  value,
  max = 100,
  unit = '',
  status = 'active',
  description
}) => {
  const percentage = typeof value === 'number' ? (value / max) * 100 : 0
  const glowColor = status === 'active' ? '#4CFF85' : status === 'warning' ? '#FFA500' : '#9CAABA'

  return (
    <div className="card-module p-3 md:p-5 relative overflow-hidden">
      {/* Radar Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <svg width="140" height="140" viewBox="0 0 120 120" className="animate-radar w-20 h-20 md:w-36 md:h-36">
          {/* Outer Circle */}
          <circle cx="60" cy="60" r="55" fill="none" stroke={glowColor} strokeWidth="1" opacity="0.3" />
          <circle cx="60" cy="60" r="40" fill="none" stroke={glowColor} strokeWidth="1" opacity="0.3" />
          <circle cx="60" cy="60" r="25" fill="none" stroke={glowColor} strokeWidth="1" opacity="0.3" />
          
          {/* Crosshair */}
          <line x1="60" y1="0" x2="60" y2="120" stroke={glowColor} strokeWidth="1" opacity="0.3" />
          <line x1="0" y1="60" x2="120" y2="60" stroke={glowColor} strokeWidth="1" opacity="0.3" />
          
          {/* Sweep Line */}
          <line
            x1="60"
            y1="60"
            x2="60"
            y2="0"
            stroke={glowColor}
            strokeWidth="2"
            opacity="0.6"
            transform={`rotate(${percentage * 3.6} 60 60)`}
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h4 className="text-[#9CAABA] text-xs md:text-sm font-medium mb-1.5 md:mb-2 leading-tight">{title}</h4>
        <div className="flex items-baseline gap-1.5 md:gap-2">
          <span 
            className="text-lg md:text-3xl font-bold"
            style={{ color: glowColor, textShadow: `0 0 20px ${glowColor}40` }}
          >
            {value}
          </span>
          {unit && <span className="text-[#9CAABA] text-xs md:text-sm">{unit}</span>}
        </div>
        {typeof value === 'number' && (
          <div className="mt-2 md:mt-3 h-1 md:h-1.5 bg-[#1C2633] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${glowColor}, ${glowColor}80)`,
                boxShadow: `0 0 10px ${glowColor}60`
              }}
            />
          </div>
        )}
        {description && (
          <p className="mt-2 md:mt-3 text-[#9CAABA] text-[10px] md:text-xs leading-tight line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

