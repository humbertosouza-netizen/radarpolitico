import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  glow?: 'green' | 'cyan'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  glow,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-6 py-3 rounded-[16px] font-medium transition-all duration-300 relative overflow-hidden'
  
  const variants = {
    primary: 'bg-transparent border border-[#1C2633] text-[#E8F0F2] hover:border-[#4CFF85] hover:glow-green',
    secondary: 'bg-[#0A111F] border border-[#1C2633] text-[#E8F0F2] hover:border-[#29F1FF] hover:glow-cyan',
    outline: 'bg-transparent border-2 border-[#4CFF85] text-[#4CFF85] hover:bg-[#4CFF85] hover:bg-opacity-10',
    ghost: 'bg-transparent text-[#9CAABA] hover:text-[#E8F0F2]'
  }

  const glowClass = glow === 'green' ? 'hover:glow-green' : glow === 'cyan' ? 'hover:glow-cyan' : ''

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${glowClass} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-[#4CFF85] to-[#29F1FF] opacity-0 hover:opacity-10 transition-opacity duration-300" />
      )}
    </button>
  )
}

