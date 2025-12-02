import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export default async function Home() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }

    redirect('/dashboard')
  } catch (error) {
    // Em caso de erro, redirecionar para login
    redirect('/login')
  }
}

