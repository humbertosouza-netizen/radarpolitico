'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { RadarWidget } from '@/components/ui/RadarWidget'
import { Card } from '@/components/ui/Card'

interface User {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'usuario'
  created_at: string
}

interface DashboardClientProps {
  user: User
}

export default function DashboardClient({ user }: DashboardClientProps) {
  // Palavras-chave reais do banco de dados
  const [realKeywords, setRealKeywords] = useState<string[]>([])
  const [currentKeyword, setCurrentKeyword] = useState(0)

  // Estados para animação de trabalho
  const workMessages = [
    'Trabalhando...',
    'Buscando menções...',
    'Lendo mensagens...',
    'Analisando grupos...',
    'Filtrando conteúdo...',
    'Processando dados...'
  ]
  const [currentWorkMessage, setCurrentWorkMessage] = useState(0)

  // Carregar palavras-chave do Supabase
  useEffect(() => {
    const loadKeywords = async () => {
      try {
        const { data, error } = await supabase
          .from('palavras_chaves')
          .select('termo')
          .order('created_at', { ascending: false })
          .limit(20) // Limitar a 20 para performance

        if (error) throw error

        // Extrair apenas os termos
        const termos = (data || []).map((item: any) => item.termo).filter(Boolean)
        
        // Se houver palavras-chave, usar elas; senão, usar fallback
        if (termos.length > 0) {
          setRealKeywords(termos)
        } else {
          // Fallback caso não haja palavras-chave cadastradas
          setRealKeywords(['eleições', 'candidatos', 'votação', 'campanha', 'política'])
        }
      } catch (error) {
        console.error('Erro ao carregar palavras-chave:', error)
        // Fallback em caso de erro
        setRealKeywords(['eleições', 'candidatos', 'votação', 'campanha', 'política'])
      }
    }

    loadKeywords()
  }, [])

  // Trocar palavra a cada 2,5 segundos
  useEffect(() => {
    if (realKeywords.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentKeyword((prev) => (prev + 1) % realKeywords.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [realKeywords.length])

  // Trocar mensagem de trabalho a cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWorkMessage((prev) => (prev + 1) % workMessages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [workMessages.length])

  // Palavras-chave para os balões flutuantes (pegar as primeiras 3)
  const floatingKeywords = realKeywords.slice(0, 3).length > 0 
    ? realKeywords.slice(0, 3) 
    : ['eleições', 'candidatos', 'votação']

  return (
    <div className="h-screen bg-[#050B16] flex flex-col md:overflow-hidden overflow-y-auto">
      <div className="flex flex-1 md:overflow-hidden min-h-0">
        <Sidebar />
        
        <main className="flex-1 w-full md:overflow-hidden overflow-y-auto p-3 md:p-6 min-w-0">
          <div className="max-w-7xl mx-auto w-full md:h-full flex flex-col">
            {/* Logo Grande Centralizada */}
            <div className="flex flex-col items-center justify-center pt-3 md:pt-4 pb-3 md:pb-4 gap-2 md:gap-3 flex-shrink-0">
              {/* Logo grande */}
              <div className="relative">
                <Image
                  src="/logoradarpolitico.png"
                  alt="Radar Político"
                  width={120}
                  height={120}
                  className="md:w-40 md:h-40 w-30 h-30 drop-shadow-[0_0_30px_rgba(16,185,129,0.75)]"
                  priority
                />
                {/* Anel externo com glow / pulso suave */}
                <div className="pointer-events-none absolute inset-0 rounded-full bg-emerald-500/5 blur-3xl" />
              </div>
              
              {/* Texto de apoio abaixo da logo */}
              <p className="text-xs md:text-base text-emerald-200/80 text-center max-w-2xl px-4">
                Seu agente está de plantão 24h, lendo grupos de WhatsApp e destacando só o que importa para a campanha.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-3 md:mb-4 flex-shrink-0">
              <RadarWidget
                title="Horas de patrulha do agente"
                value="128 h"
                status="active"
                description="Tempo total de trabalho contínuo desde a ativação do Radar Político."
              />
              <RadarWidget
                title="Grupos de WhatsApp monitorados"
                value="127 grupos"
                status="active"
                description="Total de grupos ativos sob vigilância neste momento."
              />
              <RadarWidget
                title="Menções políticas detectadas hoje"
                value="487 menções"
                status="warning"
                description="Quantidade de mensagens com citações relevantes já identificadas pela IA nas últimas 24h."
              />
              <RadarWidget
                title="Horas humanas economizadas hoje"
                value="6,5 h"
                status="active"
                description="Estimativa de tempo de trabalho que um assessor levaria para ler e filtrar o mesmo volume de mensagens."
              />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 flex-1 md:min-h-0 md:overflow-hidden">
              {/* Agente Hero Card */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl md:rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-black via-slate-950 to-emerald-950/40 shadow-[0_0_40px_rgba(16,185,129,0.35)] px-4 md:px-8 py-4 md:py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {/* Coluna Esquerda - Robô */}
                    <div className="flex flex-col items-center justify-center relative">
                      {/* Animação de Radar Pulsando Atrás */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* Círculos de radar pulsando */}
                        <div className="w-32 h-32 md:w-64 md:h-64 border-2 border-emerald-400/40 rounded-full animate-radar-pulse" style={{ animationDelay: '0s' }} />
                        <div className="absolute w-24 h-24 md:w-48 md:h-48 border border-emerald-400/30 rounded-full animate-radar-pulse" style={{ animationDelay: '0.5s' }} />
                        <div className="absolute w-16 h-16 md:w-32 md:h-32 border border-emerald-400/20 rounded-full animate-radar-pulse" style={{ animationDelay: '1s' }} />
                        {/* Círculos girando */}
                        <div className="absolute w-32 h-32 md:w-64 md:h-64 border border-emerald-400/40 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                        <div className="absolute w-24 h-24 md:w-48 md:h-48 border border-emerald-400/30 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                        <div className="absolute w-16 h-16 md:w-32 md:h-32 border border-emerald-400/20 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
                      </div>
                      
                      {/* Balões de Mensagem Flutuantes */}
                      {floatingKeywords.map((keyword, index) => (
                        <div
                          key={index}
                          className="absolute z-20 animate-float-soft hidden md:block"
                          style={{
                            top: `${20 + index * 25}%`,
                            left: index === 0 ? '10%' : index === 1 ? '75%' : '45%',
                            animationDelay: `${index * 0.5}s`,
                            animationDuration: `${4 + index * 0.5}s`
                          }}
                        >
                          <div className="relative bg-emerald-500/20 border border-emerald-500/50 rounded-xl px-3 py-2 backdrop-blur-sm">
                            <div className="text-emerald-400 text-xs font-medium whitespace-nowrap">
                              {keyword}
                            </div>
                            {/* Cauda do balão */}
                            <div className="absolute bottom-0 left-3 transform translate-y-full">
                              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-emerald-500/50" />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Imagem do Robô */}
                      <div className="relative z-10">
                        <Image
                          src="/radarpolitico.png"
                          alt="Agente Radar Político"
                          width={220}
                          height={220}
                          className="object-contain w-32 h-32 md:w-56 md:h-56"
                          priority
                        />
                      </div>
                      
                      {/* Badge */}
                      <div className="mt-2 md:mt-3 z-10 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5 md:gap-1 px-3 md:px-4 py-1.5 md:py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full">
                          <span className="text-emerald-400 text-xs md:text-sm font-medium">Agente em operação</span>
                          <span className="text-emerald-500/70 text-[10px] md:text-xs">Trabalhando 24h</span>
                        </div>
                      </div>
                    </div>

                    {/* Coluna Direita - Animações */}
                    <div className="flex flex-col justify-center items-center relative">
                      {/* Linha Dinâmica "Radar agora: monitorando {palavra}" */}
                      <div className="mb-3 md:mb-4 px-3 md:px-4 py-1.5 md:py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full inline-flex items-center gap-1.5 md:gap-2">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
                        <span className="text-[#9CAABA] text-[10px] md:text-xs">
                          Radar agora: monitorando{' '}
                          <span className="text-emerald-400 font-medium transition-all duration-500">
                            {realKeywords.length > 0 ? realKeywords[currentKeyword] : '...'}
                          </span>
                        </span>
                      </div>

                      {/* Animação de Radar Central */}
                      <div className="relative w-40 h-40 md:w-64 md:h-64 flex items-center justify-center mb-3 md:mb-4">
                        {/* Círculos de radar concêntricos pulsando */}
                        <div className="absolute w-full h-full flex items-center justify-center">
                          <div className="w-full h-full border-2 border-emerald-400/40 rounded-full animate-radar-pulse" />
                          <div className="absolute w-3/4 h-3/4 border border-emerald-400/30 rounded-full animate-radar-pulse" style={{ animationDelay: '0.3s' }} />
                          <div className="absolute w-1/2 h-1/2 border border-emerald-400/20 rounded-full animate-radar-pulse" style={{ animationDelay: '0.6s' }} />
                        </div>
                        
                        {/* Linha de varredura do radar */}
                        <div className="absolute w-full h-full flex items-center justify-center">
                          <div 
                            className="absolute w-0.5 h-1/2 bg-gradient-to-b from-emerald-400 to-transparent origin-center animate-spin"
                            style={{ 
                              animationDuration: '3s',
                              boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)'
                            }}
                          />
                        </div>

                        {/* Crosshair central */}
                        <div className="absolute w-full h-full flex items-center justify-center">
                          <div className="w-3 h-3 border-2 border-emerald-400 rounded-full">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-glow" />
                          </div>
                        </div>
                      </div>

                      {/* Mensagem de Status Dinâmica */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 md:gap-2.5 px-3 md:px-5 py-1.5 md:py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                          <div className="relative">
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-400 animate-pulse-glow" />
                            <div className="absolute inset-0 w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
                          </div>
                          <span className="text-emerald-400 font-medium text-xs md:text-sm transition-all duration-500">
                            {workMessages[currentWorkMessage]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="flex flex-col md:min-h-0 md:overflow-hidden">
                <Card title="Status do agente" className="md:h-full flex flex-col p-3 md:p-4">
                  <div className="space-y-2 md:space-y-2.5">
                    <div className="flex items-center justify-between p-2 md:p-2.5 bg-[#0A1326] rounded-lg md:rounded-xl">
                      <span className="text-[#9CAABA] text-xs md:text-sm">IA de análise</span>
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#4CFF85] animate-pulse-glow" />
                        <span className="text-[#4CFF85] text-xs md:text-sm font-medium">Online</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 md:p-2.5 bg-[#0A1326] rounded-lg md:rounded-xl">
                      <span className="text-[#9CAABA] text-xs md:text-sm">Conexão WhatsApp</span>
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#4CFF85] animate-pulse-glow" />
                        <span className="text-[#4CFF85] text-xs md:text-sm font-medium">Conectado</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 md:p-2.5 bg-[#0A1326] rounded-lg md:rounded-xl">
                      <span className="text-[#9CAABA] text-xs md:text-sm">Última mensagem</span>
                      <span className="text-[#E8F0F2] text-xs md:text-sm">há 2min</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 md:p-2.5 bg-[#0A1326] rounded-lg md:rounded-xl">
                      <span className="text-[#9CAABA] text-xs md:text-sm">Alertas críticos</span>
                      <span className="text-[#FFA500] text-xs md:text-sm font-medium">3 grupos</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileMenu />
    </div>
  )
}
