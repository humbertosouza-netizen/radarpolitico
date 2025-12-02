import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import TimelineClient from './timeline-client'

export default async function TimelinePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <TimelineClient />
}

