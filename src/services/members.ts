import { supabase } from '../utils/supabase'
import type { Member } from '../types'

export async function fetchMembers(): Promise<Member[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('Members fetch failed:', error.message)
    return []
  }
  return data as Member[]
}

export async function fetchMemberCount(): Promise<number> {
  if (!supabase) return 0

  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  if (error) return 0
  return count || 0
}
