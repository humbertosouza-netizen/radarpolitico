import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
  title?: string
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  title
}) => {
  return (
    <div className={`card-module p-3 md:p-4 ${glow ? 'glow-green' : ''} ${className}`}>
      {title && (
        <h3 className="text-[#E8F0F2] text-sm md:text-base font-semibold mb-2.5 md:mb-3 pb-2 border-b border-[#1C2633]">
          {title}
        </h3>
      )}
      <div className="flex-1 min-h-0 overflow-auto">
        {children}
      </div>
    </div>
  )
}

