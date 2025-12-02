'use client'

import React, { useEffect, useState } from 'react'

interface NotificationProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose?: () => void
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  const typeStyles = {
    success: {
      bg: 'bg-[#0A1326]',
      border: 'border-[#4CFF85]',
      text: 'text-[#4CFF85]',
      glow: 'glow-green'
    },
    error: {
      bg: 'bg-[#0A1326]',
      border: 'border-red-500',
      text: 'text-red-400',
      glow: ''
    },
    warning: {
      bg: 'bg-[#0A1326]',
      border: 'border-yellow-500',
      text: 'text-yellow-400',
      glow: ''
    },
    info: {
      bg: 'bg-[#0A1326]',
      border: 'border-[#29F1FF]',
      text: 'text-[#29F1FF]',
      glow: 'glow-cyan'
    }
  }

  const styles = typeStyles[type]

  return (
    <div
      className={`
        fixed top-6 right-6 z-50
        ${styles.bg} ${styles.border} ${styles.glow}
        border rounded-[16px] p-4
        shadow-lg backdrop-blur-sm
        animate-float
        max-w-md
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${styles.text.replace('text-', 'bg-')} animate-pulse-glow`} />
        <p className={`${styles.text} font-medium`}>{message}</p>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => onClose(), 300)
            }}
            className="ml-auto text-[#9CAABA] hover:text-[#E8F0F2] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <line x1="4" y1="4" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1="12" y1="4" x2="4" y2="12" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

