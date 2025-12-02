import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import KeywordsClient from './keywords-client'

export const dynamic = 'force-dynamic'

export default async function KeywordsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <KeywordsClient />
}

