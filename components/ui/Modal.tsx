'use client'

import React, { useEffect } from 'react'
import { Card } from './Card'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl'
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#050B16] bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative z-10 w-full ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-[#4CFF85] glow-green max-h-[90vh] md:max-h-[85vh] flex flex-col p-0">
          <div className="flex items-center justify-between mb-3 md:mb-4 flex-shrink-0 px-3 md:px-6 pt-3 md:pt-6">
            <h3 className="text-sm md:text-lg font-bold text-[#E8F0F2] pr-2 break-words leading-tight">{title}</h3>
            <button
              onClick={onClose}
              className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-[#9CAABA] hover:text-[#E8F0F2] transition-colors rounded-lg md:rounded-[8px] hover:bg-[#1C2633] flex-shrink-0"
              aria-label="Fechar modal"
            >
              <svg width="16" height="16" className="md:w-[18px] md:h-[18px]" viewBox="0 0 18 18" fill="none">
                <line x1="4" y1="4" x2="14" y2="14" stroke="currentColor" strokeWidth="2" />
                <line x1="14" y1="4" x2="4" y2="14" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto flex-1 min-h-0 px-3 md:px-6 pb-3 md:pb-6">
            {children}
          </div>
        </Card>
      </div>
    </div>
  )
}

