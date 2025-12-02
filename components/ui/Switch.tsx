import React from 'react'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label
}) => {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="text-[#9CAABA] text-sm font-medium">{label}</span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300
          ${checked 
            ? 'bg-[#4CFF85] glow-green' 
            : 'bg-[#1C2633]'
          }
          focus:outline-none focus:ring-2 focus:ring-[#4CFF85] focus:ring-offset-2 focus:ring-offset-[#050B16]
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300
            ${checked ? 'translate-x-8' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  )
}

