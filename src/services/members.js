import { supabase } from '../utils/supabase'

export async function fetchMembers() {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('Members fetch failed:', error.message)
    return []
  }
  return data
}

export async function fetchMemberCount() {
  if (!supabase) return 0

  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  if (error) return 0
  return count || 0
}
