'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { Notification } from '@/components/ui/Notification'
import { Modal } from '@/components/ui/Modal'

// Estrutura real da tabela palavras_chaves:
// - id (bigint)
// - termo (text) - a palavra-chave
// - categoria (text)
// - created_at (timestamp)
// Nota: Não há coluna 'user_id' nem 'ativo' na tabela atual

interface Keyword {
  id: number
  termo: string
  categoria: string
  created_at: string
}

interface NotificationState {
  id: string
  message: string
  type: 'success' | 'error'
}

export default function KeywordsClient() {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [loading, setLoading] = useState(true)
  const [newKeyword, setNewKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Política')
  const [notifications, setNotifications] = useState<NotificationState[]>([])
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null)
  const [mensagensCount, setMensagensCount] = useState<number | null>(null)
  const [loadingCount, setLoadingCount] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Carregar palavras-chave do Supabase
  useEffect(() => {
    loadKeywords()
  }, [])

  const loadKeywords = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('palavras_chaves')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setKeywords(data || [])
    } catch (error: any) {
      console.error('Erro ao carregar palavras-chave:', error)
      showNotification('Erro ao carregar palavras-chave', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString()
    setNotifications([...notifications, { id, message, type }])
    setTimeout(() => {
      setNotifications(notifications.filter(n => n.id !== id))
    }, 5000)
  }

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) {
      showNotification('Digite uma palavra-chave', 'error')
      return
    }

    try {
      const { data, error } = await supabase
        .from('palavras_chaves')
        .insert({
          termo: newKeyword.trim(),
          categoria: selectedCategory,
        })
        .select()
        .single()

      if (error) throw error

      const updatedKeywords = [data, ...keywords]
      setKeywords(updatedKeywords)
      setNewKeyword('')
      // Resetar para primeira página ao adicionar
      setCurrentPage(1)
      showNotification('Palavra-chave adicionada com sucesso', 'success')
    } catch (error: any) {
      console.error('Erro ao adicionar palavra-chave:', error)
      showNotification(error.message || 'Erro ao adicionar palavra-chave', 'error')
    }
  }

  // Nota: A tabela não tem coluna 'ativo', então removemos a funcionalidade de toggle
  // Se precisar dessa funcionalidade, você pode adicionar a coluna 'ativo' na tabela
  const handleToggleKeyword = async (id: number) => {
    showNotification('Funcionalidade de ativar/desativar não disponível. A tabela não possui coluna "ativo".', 'error')
  }

  const handleDeleteKeyword = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover esta palavra-chave?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('palavras_chaves')
        .delete()
        .eq('id', id)

      if (error) throw error

      const updatedKeywords = keywords.filter(k => k.id !== id)
      setKeywords(updatedKeywords)
      // Ajustar página se necessário
      const newTotalPages = Math.ceil(updatedKeywords.length / itemsPerPage)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      }
      showNotification('Palavra-chave removida com sucesso', 'success')
    } catch (error: any) {
      console.error('Erro ao remover palavra-chave:', error)
      showNotification('Erro ao remover palavra-chave', 'error')
    }
  }

  const handleOpenModal = async (keyword: Keyword) => {
    setSelectedKeyword(keyword)
    setMensagensCount(null)
    setLoadingCount(true)

    try {
      // Buscar todas as menções
      const { data: allData, error } = await supabase
        .from('investigador_mencoes')
        .select('*')

      if (error) throw error

      // Filtrar no cliente para encontrar menções que contêm esta palavra-chave
      // A busca verifica múltiplos campos: palavras_chave, resumo, descricao, texto e outros campos de texto
      const termoLower = keyword.termo.toLowerCase()
      
      const filtered = (allData || []).filter((mencao: any) => {
        // 1. Verificar campo palavras_chave (array ou string)
        const palavrasChave = mencao.palavras_chave
        if (palavrasChave) {
          if (Array.isArray(palavrasChave)) {
            if (palavrasChave.some((p: string) => 
              String(p).toLowerCase().includes(termoLower)
            )) {
              return true
            }
          } else if (typeof palavrasChave === 'string') {
            if (palavrasChave.toLowerCase().includes(termoLower)) {
              return true
            }
          }
        }

        // 2. Verificar campos de texto principais (resumo, descricao, texto)
        const camposTexto = [
          mencao.resumo,
          mencao.descricao,
          mencao.texto,
          mencao.mensagem,
          mencao.conteudo,
          mencao.detalhes
        ].filter(Boolean) // Remove valores null/undefined

        for (const campo of camposTexto) {
          if (typeof campo === 'string' && campo.toLowerCase().includes(termoLower)) {
            return true
          }
        }

        // 3. Verificar outros campos de texto (busca em todos os campos string)
        for (const [key, value] of Object.entries(mencao)) {
          // Ignorar campos não-texto e campos já verificados
          if (['id', 'created_at', 'data', 'prioridade', 'tipo', 'urgente', 'palavras_chave'].includes(key)) {
            continue
          }
          
          if (typeof value === 'string' && value.toLowerCase().includes(termoLower)) {
            return true
          }
        }

        return false
      })

      setMensagensCount(filtered.length)
    } catch (error: any) {
      console.error('Erro ao contar mensagens:', error)
      setMensagensCount(0)
    } finally {
      setLoadingCount(false)
    }
  }

  const handleCloseModal = () => {
    setSelectedKeyword(null)
    setMensagensCount(null)
  }

  // Calcular paginação
  const totalPages = Math.ceil(keywords.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedKeywords = keywords.slice(startIndex, endIndex)

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

            {/* Add Keyword Form */}
            <Card title="Adicionar Nova Palavra-chave" className="mb-4 md:mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <Input
                  label="Palavra ou Frase"
                  placeholder="ex: eleição presidencial"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                />
                <div>
                  <label className="block text-[#9CAABA] text-sm mb-2 font-medium">
                    Categoria
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0A111F] border border-[#1C2633] rounded-[16px] text-[#E8F0F2] focus:outline-none focus:border-[#4CFF85] focus:glow-green transition-all duration-300"
                  >
                    <option value="Política">Política</option>
                    <option value="Economia">Economia</option>
                    <option value="Social">Social</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddKeyword} glow="green" className="w-full">
                    Adicionar
                  </Button>
                </div>
              </div>
            </Card>

            {/* Keywords List */}
            <Card title="Palavras-chave Ativas" glow>
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
                  <p className="text-[#9CAABA]">Carregando palavras-chave...</p>
                </div>
              ) : keywords.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 opacity-20">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#4CFF85" strokeWidth="1.5">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                      <path d="M2 17L12 22L22 17" />
                      <path d="M2 12L12 17L22 12" />
                    </svg>
                  </div>
                  <p className="text-[#9CAABA]">Nenhuma palavra-chave configurada</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2.5 md:space-y-3 mb-4">
                    {paginatedKeywords.map((keyword) => (
                      <div
                        key={keyword.id}
                        className="p-3 md:p-4 bg-[#0A1326] rounded-xl md:rounded-[16px] border border-[#1C2633] hover:border-[#4CFF85] transition-all duration-300 cursor-pointer"
                        onClick={() => handleOpenModal(keyword)}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0">
                          <div className="flex items-start md:items-center gap-2 md:gap-4 flex-1 min-w-0">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-3 mb-1">
                                <span className="text-[#E8F0F2] font-medium text-sm md:text-base break-words">
                                  {keyword.termo}
                                </span>
                                <span className="px-2 py-0.5 md:py-1 text-[10px] md:text-xs bg-[#1C2633] text-[#9CAABA] rounded-lg md:rounded-[8px] inline-block w-fit">
                                  {keyword.categoria}
                                </span>
                              </div>
                              <p className="text-[#9CAABA] text-[10px] md:text-xs">
                                Adicionada em {new Date(keyword.created_at).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOpenModal(keyword)
                              }}
                              className="px-2.5 md:px-3 py-1 text-xs md:text-sm text-[#4CFF85] hover:text-[#29F1FF] transition-colors border border-[#1C2633] hover:border-[#4CFF85] rounded-lg md:rounded-[8px] whitespace-nowrap"
                            >
                              Ver Detalhes
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteKeyword(keyword.id)
                              }}
                              className="px-2.5 md:px-3 py-1 text-xs md:text-sm text-red-400 hover:text-red-300 transition-colors whitespace-nowrap"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0 pt-3 md:pt-4 border-t border-[#1C2633]">
                      <div className="text-xs md:text-sm text-[#9CAABA] text-center md:text-left">
                        Mostrando {startIndex + 1} - {Math.min(endIndex, keywords.length)} de {keywords.length} palavras-chave
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
                </>
              )}
            </Card>

            {/* Modal de Detalhes */}
            <Modal
              isOpen={selectedKeyword !== null}
              onClose={handleCloseModal}
              title={`Detalhes: ${selectedKeyword?.termo}`}
              size="md"
            >
              {selectedKeyword && (
                <div className="space-y-3 md:space-y-4">
                  {/* Informações da Palavra-chave */}
                  <div className="space-y-2.5 md:space-y-3">
                    <div>
                      <h4 className="text-[10px] md:text-xs font-medium text-[#9CAABA] mb-1.5 md:mb-2">Palavra-chave</h4>
                      <p className="text-xs md:text-sm text-[#E8F0F2] bg-[#0A1326] p-2.5 md:p-3 rounded-lg md:rounded-[12px] border border-[#1C2633] break-words">
                        {selectedKeyword.termo}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] md:text-xs font-medium text-[#9CAABA] mb-1.5 md:mb-2">Categoria</h4>
                      <span className="inline-block px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs bg-[#1C2633] text-[#9CAABA] rounded-lg md:rounded-[8px] border border-[#1C2633]">
                        {selectedKeyword.categoria}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-[10px] md:text-xs font-medium text-[#9CAABA] mb-1.5 md:mb-2">Data de Criação</h4>
                      <p className="text-[10px] md:text-xs text-[#E8F0F2] bg-[#0A1326] p-2 md:p-2.5 rounded-lg md:rounded-[8px] border border-[#1C2633]">
                        {new Date(selectedKeyword.created_at).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Contador de Mensagens */}
                  <div className="pt-3 md:pt-4 border-t border-[#1C2633]">
                    <h4 className="text-[10px] md:text-xs font-medium text-[#9CAABA] mb-2 md:mb-3">Menções Encontradas</h4>
                    {loadingCount ? (
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-[#4CFF85] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                        <span className="text-xs md:text-sm text-[#9CAABA]">Contando mensagens...</span>
                      </div>
                    ) : mensagensCount !== null ? (
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#4CFF85] animate-pulse-glow flex-shrink-0" />
                          <span className="text-base md:text-lg font-bold text-[#4CFF85]">{mensagensCount}</span>
                        </div>
                        <span className="text-xs md:text-sm text-[#9CAABA] leading-relaxed">
                          menção{mensagensCount !== 1 ? 'ões' : ''} encontrada{mensagensCount !== 1 ? 's' : ''} com esta palavra-chave
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs md:text-sm text-[#9CAABA]">
                        Não foi possível contar as mensagens
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Modal>
          </div>
        </main>
      </div>
      <MobileMenu />
    </div>
  )
}

