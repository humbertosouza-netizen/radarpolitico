'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { Card } from '@/components/ui/Card'
import { Notification } from '@/components/ui/Notification'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

// Estrutura esperada da tabela investigador_mencoes:
// Ajuste conforme a estrutura real da sua tabela
interface Mencoes {
  id: number | string
  resumo?: string // Resumo do registro do problema
  [key: string]: any // Permite outras colunas
}

interface NotificationState {
  id: string
  message: string
  type: 'success' | 'error'
}

export default function TimelineClient() {
  const [mencoes, setMencoes] = useState<Mencoes[]>([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<NotificationState[]>([])
  const [selectedMencao, setSelectedMencao] = useState<Mencoes | null>(null)
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    loadMencoes()
  }, [])

  const loadMencoes = async (fromDate?: string, toDate?: string) => {
    try {
      setLoading(true)
      let query = supabase
        .from('investigador_mencoes')
        .select('*')

      // Aplicar filtro de data inicial
      if (fromDate) {
        const from = new Date(fromDate)
        from.setHours(0, 0, 0, 0)
        // Tenta filtrar por created_at (campo mais comum)
        query = query.gte('created_at', from.toISOString())
      }

      // Aplicar filtro de data final
      if (toDate) {
        const to = new Date(toDate)
        to.setHours(23, 59, 59, 999)
        query = query.lte('created_at', to.toISOString())
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(1000) // Aumentar limite para permitir filtros

      if (error) throw error

      // Se não houver filtro de data, aplicar filtro no cliente (caso created_at não exista)
      let filteredData = data || []
      if (data && (!fromDate && !toDate)) {
        // Sem filtro, usar todos os dados
      } else if (data) {
        // Aplicar filtro adicional no cliente caso a coluna seja 'data' ao invés de 'created_at'
        filteredData = data.filter((mencao: any) => {
          const mencaoDate = mencao.created_at || mencao.data
          if (!mencaoDate) return false
          
          const date = new Date(mencaoDate)
          if (fromDate) {
            const from = new Date(fromDate)
            from.setHours(0, 0, 0, 0)
            if (date < from) return false
          }
          if (toDate) {
            const to = new Date(toDate)
            to.setHours(23, 59, 59, 999)
            if (date > to) return false
          }
          return true
        })
      }

      setMencoes(filteredData)
    } catch (error: any) {
      console.error('Erro ao carregar menções:', error)
      showNotification('Erro ao carregar menções: ' + (error.message || 'Erro desconhecido'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = () => {
    setCurrentPage(1) // Resetar para primeira página ao filtrar
    loadMencoes(dateFrom, dateTo)
  }

  const handleClearFilter = () => {
    setDateFrom('')
    setDateTo('')
    setCurrentPage(1) // Resetar para primeira página ao limpar filtro
    loadMencoes()
  }

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString()
    setNotifications([...notifications, { id, message, type }])
    setTimeout(() => {
      setNotifications(notifications.filter(n => n.id !== id))
    }, 5000)
  }

  // Formatar informações para texto legível
  const formatMencaoToText = (mencao: Mencoes): string => {
    let text = '=== DETALHES DA MENÇÃO ===\n\n'
    
    if (mencao.resumo || mencao.descricao || mencao.texto) {
      text += `RESUMO:\n${mencao.resumo || mencao.descricao || mencao.texto}\n\n`
    }
    
    if (mencao.id) text += `ID: ${mencao.id}\n`
    if (mencao.created_at || mencao.data) {
      const date = new Date(mencao.created_at || mencao.data || '')
      text += `DATA: ${date.toLocaleString('pt-BR')}\n`
    }
    if (mencao.prioridade) text += `PRIORIDADE: ${mencao.prioridade.toUpperCase()}\n`
    if (mencao.tipo) text += `TIPO: ${mencao.tipo}\n`
    if (mencao.grupo || mencao.fonte || mencao.origem) {
      text += `GRUPO/FONTE: ${mencao.grupo || mencao.fonte || mencao.origem}\n`
    }
    if (mencao.urgente !== undefined) text += `URGENTE: ${mencao.urgente ? 'SIM' : 'NÃO'}\n`
    
    if (mencao.palavras_chave) {
      const keywords = Array.isArray(mencao.palavras_chave) 
        ? mencao.palavras_chave 
        : [mencao.palavras_chave]
      text += `PALAVRAS-CHAVE: ${keywords.join(', ')}\n`
    }
    
    text += '\n--- INFORMAÇÕES ADICIONAIS ---\n'
    Object.entries(mencao).forEach(([key, value]) => {
      const excludedKeys = ['id', 'resumo', 'descricao', 'texto', 'created_at', 'data', 
        'prioridade', 'tipo', 'grupo', 'fonte', 'origem', 'urgente', 'palavras_chave']
      
      if (!excludedKeys.includes(key) && value !== null && value !== undefined && value !== '') {
        const formattedKey = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase()).trim()
        
        let formattedValue = String(value)
        if (Array.isArray(value)) {
          formattedValue = value.join(', ')
        } else if (typeof value === 'object') {
          formattedValue = JSON.stringify(value, null, 2)
        }
        
        text += `${formattedKey}: ${formattedValue}\n`
      }
    })
    
    return text
  }

  // Copiar informações para clipboard
  const handleCopy = async () => {
    if (!selectedMencao) return
    
    try {
      const text = formatMencaoToText(selectedMencao)
      await navigator.clipboard.writeText(text)
      showNotification('Informações copiadas para a área de transferência', 'success')
    } catch (error) {
      console.error('Erro ao copiar:', error)
      showNotification('Erro ao copiar informações', 'error')
    }
  }

  // Baixar ficha como arquivo
  const handleDownload = () => {
    if (!selectedMencao) return
    
    try {
      const text = formatMencaoToText(selectedMencao)
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ficha_menção_${selectedMencao.id || Date.now()}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      showNotification('Ficha baixada com sucesso', 'success')
    } catch (error) {
      console.error('Erro ao baixar:', error)
      showNotification('Erro ao baixar ficha', 'error')
    }
  }

  // Obter número de telefone do registro
  const getPhoneNumber = (mencao: Mencoes): string | null => {
    // Tentar diferentes nomes de campos comuns para telefone
    const phoneFields = ['sender_phone', 'phone', 'telefone', 'numero', 'numero_telefone', 
                         'whatsapp', 'celular', 'mobile', 'contact']
    
    for (const field of phoneFields) {
      if (mencao[field]) {
        let phone = String(mencao[field]).trim()
        // Remover caracteres não numéricos exceto +
        phone = phone.replace(/[^\d+]/g, '')
        // Se não começar com +, adicionar código do Brasil (55)
        if (!phone.startsWith('+')) {
          // Remover zeros à esquerda e adicionar 55 se necessário
          phone = phone.replace(/^0+/, '')
          if (!phone.startsWith('55')) {
            phone = '55' + phone
          }
          phone = '+' + phone
        }
        return phone
      }
    }
    return null
  }

  // Abrir WhatsApp
  const handleWhatsApp = (phone: string) => {
    if (!selectedMencao) return
    
    const resumo = selectedMencao.resumo || selectedMencao.descricao || selectedMencao.texto || 'menção registrada'
    const message = encodeURIComponent(`Olá, gostaria de mais informações sobre a menção registrada:\n\n${resumo.substring(0, 100)}${resumo.length > 100 ? '...' : ''}`)
    const phoneNumber = phone.replace(/[^\d]/g, '') // Remove tudo exceto dígitos
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  // Converter menções para formato de eventos da timeline
  const allEvents = mencoes.map((mencao, index) => {
    // Extrair informações da menção
    const resumo = mencao.resumo || mencao.descricao || mencao.texto || 'Menção detectada'
    const created_at = mencao.created_at || mencao.data || new Date().toISOString()
    const date = new Date(created_at)
    const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    
    // Determinar severidade baseado em algum campo (ajuste conforme necessário)
    const severity = mencao.prioridade === 'alta' || mencao.urgente ? 'high' :
                     mencao.prioridade === 'media' ? 'medium' : 'low'
    
    // Determinar tipo (ajuste conforme necessário)
    const type = mencao.tipo || 'keyword'
    
    // Extrair palavras-chave se houver (ajuste conforme necessário)
    const keywords = mencao.palavras_chave ? 
      (Array.isArray(mencao.palavras_chave) ? mencao.palavras_chave : [mencao.palavras_chave]) :
      []
    
    // Extrair grupo/fonte (ajuste conforme necessário)
    const group = mencao.grupo || mencao.fonte || mencao.origem || 'Sistema'

    return {
      id: mencao.id?.toString() || index.toString(),
      time,
      type: type as 'keyword' | 'alert' | 'system',
      message: resumo,
      group,
      keywords,
      severity: severity as 'low' | 'medium' | 'high',
      raw: mencao // Manter dados originais para referência
    }
  })

  // Calcular paginação
  const totalPages = Math.ceil(allEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const events = allEvents.slice(startIndex, endIndex)


  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#4CFF85'
      case 'medium':
        return '#FFA500'
      case 'low':
        return '#9CAABA'
      default:
        return '#9CAABA'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'keyword':
        return (
          <svg width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="2" fill="currentColor" />
          </svg>
        )
      case 'alert':
        return (
          <svg width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L2 14H14L8 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <line x1="8" y1="10" x2="8" y2="12" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8" cy="6" r="0.5" fill="currentColor" />
          </svg>
        )
      case 'system':
        return (
          <svg width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-screen bg-[#050B16] flex flex-col overflow-hidden">
      {notifications.map(notif => (
        <Notification
          key={notif.id}
          message={notif.message}
          type={notif.type}
          onClose={() => setNotifications(notifications.filter(n => n.id !== notif.id))}
        />
      ))}
      
      <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 safe-bottom pb-20 md:pb-6 min-w-0">
          <div className="max-w-7xl mx-auto">

            {/* Filtro de Datas */}
            <Card className="mb-4 md:mb-6" glow>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs md:text-sm font-medium text-[#E8F0F2]">Filtro de Datas</h3>
                  {(dateFrom || dateTo) && (
                    <button
                      onClick={handleClearFilter}
                      className="text-[10px] md:text-xs text-[#9CAABA] hover:text-[#4CFF85] transition-colors"
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  <Input
                    type="date"
                    label="Data Inicial"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                    className="text-xs md:text-sm"
                  />
                  <Input
                    type="date"
                    label="Data Final"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                    className="text-xs md:text-sm"
                  />
                  <div className="flex items-end">
                    <Button
                      onClick={handleFilter}
                      glow="green"
                      className="w-full px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm"
                      disabled={loading}
                    >
                      {loading ? 'Filtrando...' : 'Filtrar'}
                    </Button>
                  </div>
                </div>
                {/* Contador de Menções */}
                <div className="pt-2.5 md:pt-3 border-t border-[#1C2633]">
                  <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#4CFF85] animate-pulse-glow flex-shrink-0" />
                      <span className="text-xs md:text-sm text-[#9CAABA]">
                        <span className="text-[#4CFF85] font-medium">{allEvents.length}</span> menção{allEvents.length !== 1 ? 'ões' : ''} encontrada{allEvents.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {(dateFrom || dateTo) && (
                      <span className="text-[10px] md:text-sm text-[#9CAABA] leading-relaxed">
                        {dateFrom && dateTo 
                          ? `entre ${new Date(dateFrom).toLocaleDateString('pt-BR')} e ${new Date(dateTo).toLocaleDateString('pt-BR')}`
                          : dateFrom 
                          ? `a partir de ${new Date(dateFrom).toLocaleDateString('pt-BR')}`
                          : `até ${new Date(dateTo).toLocaleDateString('pt-BR')}`
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card title="Menções Recentes" glow>
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 opacity-20 animate-pulse-glow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#4CFF85" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <line x1="12" y1="2" x2="12" y2="22" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                    </svg>
                  </div>
                  <p className="text-[#9CAABA]">Carregando menções...</p>
                </div>
              ) : allEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 opacity-20">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#4CFF85" strokeWidth="1.5">
                      <line x1="3" y1="4" x2="21" y2="4" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <line x1="3" y1="16" x2="21" y2="16" />
                    </svg>
                  </div>
                  <p className="text-[#9CAABA]">Nenhuma menção encontrada</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-[#1C2633]" />

                  <div className="space-y-4 md:space-y-6">
                    {events.map((event) => (
                      <div key={event.id} className="relative flex gap-3 md:gap-6">
                        {/* Time Indicator */}
                        <div className="flex-shrink-0 w-12 md:w-16 text-right">
                          <span className="text-[#9CAABA] text-xs md:text-sm font-mono">
                            {event.time}
                          </span>
                        </div>

                        {/* Event Dot */}
                        <div className="flex-shrink-0 relative z-10">
                          <div
                            className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2"
                            style={{
                              backgroundColor: getSeverityColor(event.severity),
                              borderColor: getSeverityColor(event.severity),
                              boxShadow: `0 0 10px ${getSeverityColor(event.severity)}60`
                            }}
                          />
                        </div>

                        {/* Event Content */}
                        <div className="flex-1 pb-4 md:pb-6 min-w-0">
                          <div 
                            className="p-3 md:p-4 bg-[#0A1326] rounded-xl md:rounded-[16px] border border-[#1C2633] hover:border-[#4CFF85] transition-all duration-300 cursor-pointer"
                            onClick={() => setSelectedMencao(event.raw)}
                          >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-0 mb-2 md:mb-3">
                              <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                                <div
                                  className="text-[#4CFF85] flex-shrink-0 mt-0.5"
                                  style={{ color: getSeverityColor(event.severity) }}
                                >
                                  {getTypeIcon(event.type)}
                                </div>
                                <span className="text-[#E8F0F2] font-medium text-sm md:text-base break-words">
                                  {event.message}
                                </span>
                              </div>
                              <span
                                className="px-2 py-0.5 md:py-1 text-[10px] md:text-xs rounded-lg md:rounded-[8px] font-medium whitespace-nowrap flex-shrink-0"
                                style={{
                                  backgroundColor: `${getSeverityColor(event.severity)}20`,
                                  color: getSeverityColor(event.severity)
                                }}
                              >
                                {event.severity.toUpperCase()}
                              </span>
                            </div>
                            
                            <p className="text-[#9CAABA] text-xs md:text-sm mb-2">
                              Grupo: <span className="text-[#E8F0F2]">{event.group}</span>
                            </p>
                            
                            {event.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 md:gap-2">
                                {event.keywords.map((keyword, i) => (
                                  <span
                                    key={i}
                                    className="px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs bg-[#1C2633] text-[#4CFF85] rounded-lg md:rounded-[8px] border border-[#4CFF85] border-opacity-30"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0 pt-4 md:pt-6 mt-4 md:mt-6 border-t border-[#1C2633]">
                      <div className="text-xs md:text-sm text-[#9CAABA] text-center md:text-left">
                        Mostrando {startIndex + 1} - {Math.min(endIndex, allEvents.length)} de {allEvents.length} menção{allEvents.length !== 1 ? 'ões' : ''}
                      </div>
                      <div className="flex items-center gap-2 w-full md:w-auto justify-center">
                        <Button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-2.5 md:px-3 py-1 md:py-1.5 text-xs md:text-sm flex-1 md:flex-initial"
                          glow={currentPage > 1 ? 'green' : undefined}
                        >
                          Anterior
                        </Button>
                        <div className="text-xs md:text-sm text-[#9CAABA] px-2 md:px-3 whitespace-nowrap">
                          Página {currentPage} de {totalPages}
                        </div>
                        <Button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="px-2.5 md:px-3 py-1 md:py-1.5 text-xs md:text-sm flex-1 md:flex-initial"
                          glow={currentPage < totalPages ? 'green' : undefined}
                        >
                          Próxima
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
      <MobileMenu />

      {/* Modal de Detalhes da Menção */}
      <Modal
        isOpen={selectedMencao !== null}
        onClose={() => setSelectedMencao(null)}
        title="Detalhes da Menção"
        size="md"
      >
        {selectedMencao && (
          <div className="space-y-3 md:space-y-4">
            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-2 pb-2.5 md:pb-3 border-b border-[#1C2633]">
              <button
                onClick={handleCopy}
                className="px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs bg-[#0A1326] border border-[#1C2633] text-[#E8F0F2] rounded-lg md:rounded-[8px] hover:border-[#4CFF85] hover:glow-green transition-all duration-300 flex items-center gap-1.5 md:gap-2 flex-1 md:flex-initial"
              >
                <svg width="12" height="12" className="md:w-[14px] md:h-[14px]" viewBox="0 0 14 14" fill="none">
                  <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 10V2C2 1.44772 2.44772 1 3 1H11" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                Copiar
              </button>
              <button
                onClick={handleDownload}
                className="px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs bg-[#0A1326] border border-[#1C2633] text-[#E8F0F2] rounded-lg md:rounded-[8px] hover:border-[#29F1FF] hover:glow-cyan transition-all duration-300 flex items-center gap-1.5 md:gap-2 flex-1 md:flex-initial"
              >
                <svg width="12" height="12" className="md:w-[14px] md:h-[14px]" viewBox="0 0 14 14" fill="none">
                  <path d="M7 10V1M7 10L4 7M7 10L10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1 12H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Baixar Ficha
              </button>
            </div>

            {/* Resumo Principal */}
            {(selectedMencao.resumo || selectedMencao.descricao || selectedMencao.texto) && (
              <div>
                <h4 className="text-[10px] md:text-xs font-medium text-[#9CAABA] mb-1.5 md:mb-2">Resumo</h4>
                <p className="text-xs md:text-sm text-[#E8F0F2] bg-[#0A1326] p-2.5 md:p-3 rounded-lg md:rounded-[12px] border border-[#1C2633] leading-relaxed break-words">
                  {selectedMencao.resumo || selectedMencao.descricao || selectedMencao.texto}
                </p>
              </div>
            )}

            {/* Informações em Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3">
              {/* ID */}
              {selectedMencao.id && (
                <div>
                  <h4 className="text-[10px] md:text-xs font-medium text-[#9CAABA] mb-1">ID</h4>
                  <p className="text-[10px] md:text-xs text-[#E8F0F2] bg-[#0A1326] p-2 rounded-lg md:rounded-[8px] border border-[#1C2633] break-words">
                    {selectedMencao.id}
                  </p>
                </div>
              )}

              {/* Data de Criação */}
              {(selectedMencao.created_at || selectedMencao.data) && (
                <div>
                  <h4 className="text-[10px] md:text-xs font-medium text-[#9CAABA] mb-1">Data</h4>
                  <p className="text-[10px] md:text-xs text-[#E8F0F2] bg-[#0A1326] p-2 rounded-lg md:rounded-[8px] border border-[#1C2633]">
                    {new Date(selectedMencao.created_at || selectedMencao.data || '').toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              {/* Prioridade */}
              {selectedMencao.prioridade && (
                <div>
                  <h4 className="text-[10px] md:text-xs font-medium text-[#9CAABA] mb-1">Prioridade</h4>
                  <span
                    className="inline-block px-2 py-0.5 md:py-1 rounded-lg md:rounded-[6px] text-[10px] md:text-xs font-medium"
                    style={{
                      backgroundColor: selectedMencao.prioridade === 'alta' ? '#4CFF8520' :
                                     selectedMencao.prioridade === 'media' ? '#FFA50020' : '#9CAABA20',
                      color: selectedMencao.prioridade === 'alta' ? '#4CFF85' :
                            selectedMencao.prioridade === 'media' ? '#FFA500' : '#9CAABA'
                    }}
                  >
                    {selectedMencao.prioridade.toUpperCase()}
                  </span>
                </div>
              )}

              {/* Tipo */}
              {selectedMencao.tipo && (
                <div>
                  <h4 className="text-[10px] md:text-xs font-medium text-[#9CAABA] mb-1">Tipo</h4>
                  <p className="text-[10px] md:text-xs text-[#E8F0F2] bg-[#0A1326] p-2 rounded-lg md:rounded-[8px] border border-[#1C2633] break-words">
                    {selectedMencao.tipo}
                  </p>
                </div>
              )}

              {/* Grupo/Fonte */}
              {(selectedMencao.grupo || selectedMencao.fonte || selectedMencao.origem) && (
                <div className="col-span-1 md:col-span-2">
                  <h4 className="text-[10px] md:text-xs font-medium text-[#9CAABA] mb-1">Grupo/Fonte</h4>
                  <p className="text-[10px] md:text-xs text-[#E8F0F2] bg-[#0A1326] p-2 rounded-lg md:rounded-[8px] border border-[#1C2633] break-words">
                    {selectedMencao.grupo || selectedMencao.fonte || selectedMencao.origem}
                  </p>
                </div>
              )}

              {/* Sender Phone / Telefone com WhatsApp */}
              {getPhoneNumber(selectedMencao) && (
                <div className="col-span-1 md:col-span-2">
                  <h4 className="text-[10px] md:text-xs font-medium text-[#9CAABA] mb-1">Telefone</h4>
                  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                    <p className="text-[10px] md:text-xs text-[#E8F0F2] bg-[#0A1326] p-2 rounded-lg md:rounded-[8px] border border-[#1C2633] flex-1 font-mono break-all">
                      {getPhoneNumber(selectedMencao)}
                    </p>
                    <button
                      onClick={() => handleWhatsApp(getPhoneNumber(selectedMencao)!)}
                      className="px-2.5 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs bg-[#25D366] bg-opacity-20 border border-[#25D366] text-[#25D366] rounded-lg md:rounded-[8px] hover:bg-opacity-30 hover:glow-green transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 font-medium whitespace-nowrap"
                      title="Enviar mensagem no WhatsApp"
                    >
                      <svg width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1C4.13401 1 1 3.85058 1 7.4C1 9.10958 1.71201 10.6606 2.85601 11.8L1 15L4.5 13.3C5.61201 13.7 6.77801 13.9 8 13.9C11.866 13.9 15 11.0494 15 7.5C15 3.95058 11.866 1 8 1Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M11 7C11 7.55228 10.5523 8 10 8C9.44772 8 9 7.55228 9 7C9 6.44772 9.44772 6 10 6C10.5523 6 11 6.44772 11 7Z" fill="currentColor" />
                        <path d="M7 7C7 7.55228 6.55228 8 6 8C5.44772 8 5 7.55228 5 7C5 6.44772 5.44772 6 6 6C6.55228 6 7 6.44772 7 7Z" fill="currentColor" />
                        <path d="M8 10C7.5 10 7 9.8 6.6 9.5L4 10L4.5 7.4C4.2 7 4 6.5 4 6C4 4.3 5.3 3 7 3C8.7 3 10 4.3 10 6C10 7.7 8.7 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      WhatsApp
                    </button>
                  </div>
                </div>
              )}

              {/* Urgente */}
              {selectedMencao.urgente !== undefined && (
                <div>
                  <h4 className="text-[10px] md:text-xs font-medium text-[#9CAABA] mb-1">Urgente</h4>
                  <span
                    className={`inline-block px-2 py-0.5 md:py-1 rounded-lg md:rounded-[6px] text-[10px] md:text-xs font-medium ${
                      selectedMencao.urgente 
                        ? 'bg-red-900/30 text-red-400' 
                        : 'bg-[#1C2633] text-[#9CAABA]'
                    }`}
                  >
                    {selectedMencao.urgente ? 'SIM' : 'NÃO'}
                  </span>
                </div>
              )}
            </div>

            {/* Palavras-chave */}
            {selectedMencao.palavras_chave && (
              <div>
                <h4 className="text-[10px] md:text-xs font-medium text-[#9CAABA] mb-1.5 md:mb-2">Palavras-chave</h4>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {(Array.isArray(selectedMencao.palavras_chave) 
                    ? selectedMencao.palavras_chave 
                    : [selectedMencao.palavras_chave]
                  ).map((keyword: string, i: number) => (
                    <span
                      key={i}
                      className="px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs bg-[#1C2633] text-[#4CFF85] rounded-lg md:rounded-[6px] border border-[#4CFF85] border-opacity-30"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Informações Adicionais Organizadas */}
            {Object.entries(selectedMencao)
              .filter(([key, value]) => {
                // Filtrar campos já exibidos acima e campos vazios
                const excludedKeys = ['id', 'resumo', 'descricao', 'texto', 'created_at', 'data', 
                  'prioridade', 'tipo', 'grupo', 'fonte', 'origem', 'urgente', 'palavras_chave']
                
                if (excludedKeys.includes(key)) return false
                if (value === null || value === undefined || value === '') return false
                if (Array.isArray(value) && value.length === 0) return false
                if (typeof value === 'object' && Object.keys(value).length === 0) return false
                
                return true
              })
              .length > 0 && (
              <div>
                <h4 className="text-[10px] md:text-xs font-medium text-[#9CAABA] mb-2 md:mb-3">Informações Adicionais</h4>
                <div className="space-y-2 md:space-y-2.5">
                  {Object.entries(selectedMencao)
                    .filter(([key, value]) => {
                      const excludedKeys = ['id', 'resumo', 'descricao', 'texto', 'created_at', 'data', 
                        'prioridade', 'tipo', 'grupo', 'fonte', 'origem', 'urgente', 'palavras_chave']
                      
                      if (excludedKeys.includes(key)) return false
                      if (value === null || value === undefined || value === '') return false
                      if (Array.isArray(value) && value.length === 0) return false
                      if (typeof value === 'object' && Object.keys(value).length === 0) return false
                      
                      return true
                    })
                    .map(([key, value]) => {
                      // Formatar o nome da chave
                      const formattedKey = key
                        .replace(/_/g, ' ')
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())
                        .trim()

                      // Formatar o valor
                      let formattedValue: React.ReactNode = value
                      
                      if (typeof value === 'boolean') {
                        formattedValue = (
                          <span className={value ? 'text-[#4CFF85]' : 'text-[#9CAABA]'}>
                            {value ? 'Sim' : 'Não'}
                          </span>
                        )
                      } else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                        formattedValue = (
                          <div className="space-y-1">
                            {Object.entries(value as Record<string, any>).map(([subKey, subValue]) => (
                              <div key={subKey} className="pl-3 border-l border-[#1C2633] text-xs">
                                <span className="text-[#9CAABA]">{subKey}: </span>
                                <span className="text-[#E8F0F2]">{String(subValue)}</span>
                              </div>
                            ))}
                          </div>
                        )
                      } else if (Array.isArray(value)) {
                        formattedValue = (
                          <div className="flex flex-wrap gap-1.5">
                            {value.map((item: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 text-xs bg-[#1C2633] text-[#4CFF85] rounded-[6px] border border-[#4CFF85] border-opacity-30"
                              >
                                {String(item)}
                              </span>
                            ))}
                          </div>
                        )
                      } else if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
                        // Tentar formatar como data
                        try {
                          formattedValue = new Date(value).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        } catch {
                          formattedValue = value
                        }
                      } else {
                        formattedValue = String(value)
                      }

                      return (
                        <div key={key} className="bg-[#0A1326] p-2 md:p-2.5 rounded-lg md:rounded-[8px] border border-[#1C2633]">
                          <div className="flex flex-col gap-1 md:gap-1.5">
                            <h5 className="text-[10px] md:text-xs font-medium text-[#4CFF85]">{formattedKey}</h5>
                            <div className="text-[10px] md:text-xs text-[#E8F0F2] break-words">
                              {formattedValue}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

