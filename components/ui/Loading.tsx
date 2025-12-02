'use client'

import React from 'react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Radar Circles */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="animate-radar"
        >
          {/* Outer Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#4CFF85"
            strokeWidth="2"
            opacity="0.3"
          />
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="#4CFF85"
            strokeWidth="2"
            opacity="0.3"
          />
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="#4CFF85"
            strokeWidth="2"
            opacity="0.3"
          />
          
          {/* Crosshair */}
          <line
            x1="50"
            y1="5"
            x2="50"
            y2="95"
            stroke="#4CFF85"
            strokeWidth="1"
            opacity="0.3"
          />
          <line
            x1="5"
            y1="50"
            x2="95"
            y2="50"
            stroke="#4CFF85"
            strokeWidth="1"
            opacity="0.3"
          />
          
          {/* Sweep Line */}
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="5"
            stroke="#4CFF85"
            strokeWidth="2"
            opacity="0.8"
            className="animate-radar"
          />
          
          {/* Center Dot */}
          <circle
            cx="50"
            cy="50"
            r="4"
            fill="#4CFF85"
            opacity="0.8"
            className="animate-pulse-glow"
          />
        </svg>
      </div>
      {text && (
        <p className="text-[#9CAABA] text-sm font-medium">{text}</p>
      )}
    </div>
  )
}

