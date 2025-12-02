'use client'

import React from 'react'
import Image from 'next/image'

interface RadarLogoProps {
  size?: number
  compact?: boolean
  className?: string
}

export const RadarLogo: React.FC<RadarLogoProps> = ({
  size = 40,
  compact = false,
  className = '',
}) => {
  // A logo já contém o texto "RADAR POLÍTICO", então apenas exibimos a imagem
  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <Image
        src="/logoradarpolitico.png"
        alt="Radar Político"
        width={size}
        height={size}
        className="drop-shadow-[0_0_15px_rgba(16,185,129,0.65)]"
        style={{
          objectFit: 'contain',
        }}
        priority
      />
    </div>
  )
}

