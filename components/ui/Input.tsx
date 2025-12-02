import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[#9CAABA] text-xs md:text-sm mb-1.5 md:mb-2 font-medium">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 md:px-4 py-2.5 md:py-3 
          bg-[#0A111F] 
          border border-[#1C2633] 
          rounded-xl md:rounded-[16px] 
          text-[#E8F0F2] 
          text-sm md:text-base
          placeholder-[#9CAABA]
          focus:outline-none 
          focus:border-[#4CFF85] 
          focus:glow-green
          transition-all duration-300
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 md:mt-2 text-xs md:text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

