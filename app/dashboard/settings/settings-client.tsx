'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { Notification } from '@/components/ui/Notification'

interface SettingsClientProps {
  user: {
    id: string
    email: string
    full_name: string | null
  }
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([])
  const [settings, setSettings] = useState({
    autoMonitoring: true,
    emailAlerts: true,
    highPriorityOnly: false,
    aiAnalysis: true,
    realTimeUpdates: true,
  })

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString()
    setNotifications([...notifications, { id, message, type }])
    setTimeout(() => {
      setNotifications(notifications.filter(n => n.id !== id))
    }, 5000)
  }

  const handleSave = () => {
    showNotification('Configurações salvas com sucesso', 'success')
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
        
        <main className="flex-1 overflow-y-auto p-3 md:p-6 safe-bottom pb-20 md:pb-6 min-w-0">
          <div className="max-w-4xl mx-auto">

            {/* Profile Settings */}
            <Card title="Perfil" className="mb-4 md:mb-6">
              <div className="space-y-3 md:space-y-4">
                <Input
                  label="Nome Completo"
                  defaultValue={user.full_name || ''}
                  placeholder="Seu nome completo"
                />
                <Input
                  label="Email"
                  type="email"
                  defaultValue={user.email}
                  disabled
                />
                <div className="flex justify-end">
                  <Button onClick={handleSave} glow="green" className="w-full md:w-auto text-xs md:text-sm px-4 py-2 md:py-2.5">
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            </Card>

            {/* Monitoring Settings */}
            <Card title="Monitoramento" className="mb-4 md:mb-6" glow>
              <div className="space-y-3 md:space-y-6">
                <div className="flex items-center justify-between p-3 md:p-4 bg-[#0A1326] rounded-xl md:rounded-[16px] border border-[#1C2633] gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#E8F0F2] font-medium mb-0.5 md:mb-1 text-sm md:text-base">Monitoramento Automático</h4>
                    <p className="text-[#9CAABA] text-xs md:text-sm leading-tight">Ativar detecção automática de palavras-chave</p>
                  </div>
                  <Switch
                    checked={settings.autoMonitoring}
                    onChange={(checked) => setSettings({ ...settings, autoMonitoring: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 md:p-4 bg-[#0A1326] rounded-xl md:rounded-[16px] border border-[#1C2633] gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#E8F0F2] font-medium mb-0.5 md:mb-1 text-sm md:text-base">Alertas por Email</h4>
                    <p className="text-[#9CAABA] text-xs md:text-sm leading-tight">Receber notificações por email</p>
                  </div>
                  <Switch
                    checked={settings.emailAlerts}
                    onChange={(checked) => setSettings({ ...settings, emailAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 md:p-4 bg-[#0A1326] rounded-xl md:rounded-[16px] border border-[#1C2633] gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#E8F0F2] font-medium mb-0.5 md:mb-1 text-sm md:text-base">Apenas Alta Prioridade</h4>
                    <p className="text-[#9CAABA] text-xs md:text-sm leading-tight">Notificar apenas eventos de alta prioridade</p>
                  </div>
                  <Switch
                    checked={settings.highPriorityOnly}
                    onChange={(checked) => setSettings({ ...settings, highPriorityOnly: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 md:p-4 bg-[#0A1326] rounded-xl md:rounded-[16px] border border-[#1C2633] gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#E8F0F2] font-medium mb-0.5 md:mb-1 text-sm md:text-base">Análise por IA</h4>
                    <p className="text-[#9CAABA] text-xs md:text-sm leading-tight">Usar inteligência artificial para análise</p>
                  </div>
                  <Switch
                    checked={settings.aiAnalysis}
                    onChange={(checked) => setSettings({ ...settings, aiAnalysis: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 md:p-4 bg-[#0A1326] rounded-xl md:rounded-[16px] border border-[#1C2633] gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#E8F0F2] font-medium mb-0.5 md:mb-1 text-sm md:text-base">Atualizações em Tempo Real</h4>
                    <p className="text-[#9CAABA] text-xs md:text-sm leading-tight">Receber atualizações instantâneas</p>
                  </div>
                  <Switch
                    checked={settings.realTimeUpdates}
                    onChange={(checked) => setSettings({ ...settings, realTimeUpdates: checked })}
                  />
                </div>
              </div>
            </Card>

            {/* System Info */}
            <Card title="Informações do Sistema">
              <div className="space-y-2.5 md:space-y-3">
                <div className="flex justify-between items-center p-2.5 md:p-3 bg-[#0A1326] rounded-xl md:rounded-[16px]">
                  <span className="text-[#9CAABA] text-xs md:text-sm">Versão</span>
                  <span className="text-[#E8F0F2] text-xs md:text-sm font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between items-center p-2.5 md:p-3 bg-[#0A1326] rounded-xl md:rounded-[16px]">
                  <span className="text-[#9CAABA] text-xs md:text-sm">Última Atualização</span>
                  <span className="text-[#E8F0F2] text-xs md:text-sm font-medium">2024-12-01</span>
                </div>
                <div className="flex justify-between items-center p-2.5 md:p-3 bg-[#0A1326] rounded-xl md:rounded-[16px]">
                  <span className="text-[#9CAABA] text-xs md:text-sm">Status do Serviço</span>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#4CFF85] animate-pulse-glow flex-shrink-0" />
                    <span className="text-[#4CFF85] text-xs md:text-sm font-medium">Operacional</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
      <MobileMenu />
    </div>
  )
}

