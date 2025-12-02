'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('Tentando criar conta...')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'usuario',
          },
        },
      })

      if (error) {
        console.error('Erro no cadastro:', error)
        throw error
      }

      console.log('Cadastro bem-sucedido:', data.user?.id)
      
      if (data.user) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError('Verifique seu email para confirmar a conta')
      }
    } catch (err: any) {
      console.error('Erro capturado:', err)
      setError(err.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050B16] flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4CFF85] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#29F1FF] opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src="/logoradarpolitico.png"
                alt="Radar Político"
                width={120}
                height={120}
                className="drop-shadow-[0_0_30px_rgba(16,185,129,0.75)]"
                priority
              />
              {/* Anel externo com glow / pulso suave */}
              <div className="pointer-events-none absolute inset-0 rounded-full bg-emerald-500/5 blur-3xl" />
            </div>
          </div>
        </div>

        {/* Signup Card */}
        <div className="card-module p-8 border-glow">
          <h2 className="text-2xl font-bold text-[#E8F0F2] mb-6 text-center">
            Criar Conta
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-[16px] text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-[#9CAABA] text-sm mb-2 font-medium">
                Nome Completo
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A111F] border border-[#1C2633] rounded-[16px] text-[#E8F0F2] placeholder-[#9CAABA] focus:outline-none focus:border-[#4CFF85] focus:glow-green transition-all duration-300"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[#9CAABA] text-sm mb-2 font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A111F] border border-[#1C2633] rounded-[16px] text-[#E8F0F2] placeholder-[#9CAABA] focus:outline-none focus:border-[#4CFF85] focus:glow-green transition-all duration-300"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[#9CAABA] text-sm mb-2 font-medium">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="w-full px-4 py-3 bg-[#0A111F] border border-[#1C2633] rounded-[16px] text-[#E8F0F2] placeholder-[#9CAABA] focus:outline-none focus:border-[#4CFF85] focus:glow-green transition-all duration-300"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-transparent border-2 border-[#4CFF85] text-[#4CFF85] rounded-[16px] font-medium hover:bg-[#4CFF85] hover:bg-opacity-10 hover:glow-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#4CFF85] border-t-transparent rounded-full animate-spin" />
                  Criando conta...
                </span>
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#9CAABA] text-sm">
              Já tem uma conta?{' '}
              <Link
                href="/login"
                className="text-[#4CFF85] hover:text-[#29F1FF] transition-colors font-medium"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[#9CAABA] text-xs">
          Sistema de monitoramento e análise política
        </p>
      </div>
    </div>
  )
}
