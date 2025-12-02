'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Monitoramento',
    path: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
        <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" />
        <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    label: 'Palavras-chave',
    path: '/dashboard/keywords',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12 8H18L13 12L15 18L10 14L5 18L7 12L2 8H8L10 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    )
  },
  {
    label: 'Timeline',
    path: '/dashboard/timeline',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <line x1="3" y1="4" x2="17" y2="4" stroke="currentColor" strokeWidth="1.5" />
        <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" />
        <line x1="3" y1="16" x2="17" y2="16" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="6" cy="4" r="1.5" fill="currentColor" />
        <circle cx="14" cy="10" r="1.5" fill="currentColor" />
        <circle cx="10" cy="16" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    label: 'Configurações',
    path: '/dashboard/settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 1V3M10 17V19M19 10H17M3 10H1M16.66 3.34L15.24 4.76M4.76 15.24L3.34 16.66M16.66 16.66L15.24 15.24M4.76 4.76L3.34 3.34" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }
]

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Botão de Menu (Hambúrguer) - Apenas Desktop */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex fixed top-4 left-4 z-50 p-2 bg-slate-950/90 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-slate-900 hover:border-emerald-500/40 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
        aria-label="Toggle menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Overlay quando menu está aberto - Apenas Desktop */}
      {isOpen && (
        <div
          className="hidden md:block fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Suspenso - Apenas Desktop */}
      {isOpen && (
        <div
          className="hidden md:block fixed top-16 left-4 z-40 bg-slate-950/95 border border-emerald-500/20 rounded-xl shadow-[0_0_40px_rgba(16,185,129,0.35)] backdrop-blur-md overflow-hidden"
          style={{
            animation: 'slideDown 0.2s ease-out'
          }}
        >
          <nav className="p-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm min-w-[200px]
                    ${isActive
                      ? 'bg-[#1C2633] border border-[#4CFF85] glow-green text-[#4CFF85]'
                      : 'text-[#9CAABA] hover:text-[#E8F0F2] hover:bg-[#0A1326]'
                    }
                  `}
                >
                  <span className={`${isActive ? 'text-[#4CFF85]' : ''} flex-shrink-0`}>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
            {/* Botão Sair */}
            <div className="pt-2 mt-2 border-t border-[#1C2633]">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm min-w-[200px] w-full text-red-400 hover:text-red-300 hover:bg-red-900/10"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                  <path d="M13 7L11.59 8.41L13.17 10H6V12H13.17L11.59 13.59L13 15L17 11L13 7Z" fill="currentColor" />
                  <path d="M4 2H10C10.5523 2 11 2.44772 11 3V5H9V4H4V16H9V15H11V17C11 17.5523 10.5523 18 10 18H4C3.44772 18 3 17.5523 3 17V3C3 2.44772 3.44772 2 4 2Z" fill="currentColor" />
                </svg>
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

