'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { RadarLogo } from '@/components/brand/RadarLogo'

export const Topbar: React.FC = () => {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-16 bg-[#0A111F] border-b border-[#1C2633] flex items-center justify-between px-4 md:px-6 safe-top">
      {/* Logo and Brand - apenas no mobile (no desktop a logo está na Sidebar) */}
      <div className="flex items-center gap-3 md:hidden">
        <RadarLogo size={48} />
        {/* Indicador de status */}
        <div className="flex items-center gap-1.5 text-xs text-emerald-300/80">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span>Agente em operação 24h</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-[#9CAABA] hover:text-[#E8F0F2] transition-colors"
        >
          Sair
        </button>
      </div>
    </header>
  )
}

