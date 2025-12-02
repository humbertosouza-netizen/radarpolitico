'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestConnectionPage() {
  const [status, setStatus] = useState<string>('Testando conexão...')
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        // Testar se as variáveis de ambiente estão definidas
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!url || !key) {
          setStatus('❌ Erro: Variáveis de ambiente não encontradas')
          setDetails({ url: !!url, key: !!key })
          return
        }

        setStatus('✅ Variáveis de ambiente OK')
        setDetails({ url, key: key.substring(0, 20) + '...' })

        // Testar conexão com Supabase
        const { data, error } = await supabase.from('users').select('count').limit(1)

        if (error) {
          setStatus(`❌ Erro na conexão: ${error.message}`)
          setDetails({ ...details, error: error.message, code: error.code })
        } else {
          setStatus('✅ Conexão com Supabase OK!')
          setDetails({ ...details, success: true })
        }

        // Testar autenticação
        const { data: authData, error: authError } = await supabase.auth.getSession()
        if (authError) {
          setDetails((prev: any) => ({ ...prev, authError: authError.message }))
        } else {
          setDetails((prev: any) => ({ 
            ...prev, 
            session: authData.session ? 'Sessão ativa' : 'Sem sessão' 
          }))
        }
      } catch (err: any) {
        setStatus(`❌ Erro: ${err.message}`)
        setDetails({ error: err.message, stack: err.stack })
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-2xl w-full bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Teste de Conexão Supabase</h1>
        <div className="mb-4">
          <p className="text-lg font-semibold">{status}</p>
        </div>
        {details && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Detalhes:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        )}
        <div className="mt-6">
          <a
            href="/login"
            className="text-indigo-600 hover:text-indigo-500"
          >
            ← Voltar para Login
          </a>
        </div>
      </div>
    </div>
  )
}

