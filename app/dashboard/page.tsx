import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DashboardClient from './dashboard-client'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }

    // Buscar dados do usuário na tabela users
    let { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // Se o usuário não existe na tabela, criar automaticamente
    if (error && error.code === 'PGRST116') {
      console.log('Usuário não encontrado na tabela, criando registro...')
      
      // Tentar inserir o registro
      const insertResult = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.user_metadata?.nome || null,
          role: (user.user_metadata?.role as 'admin' | 'usuario') || 'usuario',
        })
        .select()
        .single()

      if (insertResult.error) {
        console.error('Erro ao criar registro do usuário:', insertResult.error)
        // Se falhar, tentar buscar novamente (pode ter sido criado pelo trigger)
        const retryResult = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (retryResult.error || !retryResult.data) {
          console.error('Erro ao buscar usuário após tentativa de criação:', retryResult.error)
          redirect('/login')
        }
        
        userData = retryResult.data
      } else {
        userData = insertResult.data
      }
    } else if (error || !userData) {
      console.error('Erro ao buscar dados do usuário:', error)
      redirect('/login')
    }

    return <DashboardClient user={userData} />
  } catch (error) {
    console.error('Erro no dashboard:', error)
    redirect('/login')
  }
}

