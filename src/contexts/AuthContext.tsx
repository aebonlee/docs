import { createContext, useContext, useState, useEffect, useCallback, type ReactElement, type ReactNode } from 'react'
import { supabase } from '../utils/supabase'
import { isAdmin } from '../config/admin'
import type { AuthContextValue, AccountBlock, SupabaseUser } from '../types'

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue | null {
  return useContext(AuthContext)
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactElement {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [accountBlock, setAccountBlock] = useState<AccountBlock | null>(null)

  const clearAccountBlock = useCallback(() => setAccountBlock(null), [])

  // visited_sites / signup_domain / check_user_status 처리
  const handlePostAuth = useCallback(async (userId: string) => {
    if (!supabase || !userId) return

    const currentDomain = window.location.hostname
    const { data } = await supabase
      .from('user_profiles')
      .select('signup_domain, visited_sites')
      .eq('id', userId)
      .single()

    if (data) {
      const updates: Record<string, unknown> = {}
      if (!data.signup_domain) updates.signup_domain = currentDomain
      const sites = Array.isArray(data.visited_sites) ? data.visited_sites as string[] : []
      if (!sites.includes(currentDomain)) {
        updates.visited_sites = [...sites, currentDomain]
      }
      if (Object.keys(updates).length > 0) {
        supabase.from('user_profiles').update(updates).eq('id', userId).then(() => {})
      }
    }

    // 계정 상태 체크
    try {
      const { data: statusData } = await supabase.rpc('check_user_status', {
        target_user_id: userId,
        current_domain: currentDomain,
      })
      if (statusData && statusData.status && statusData.status !== 'active') {
        setAccountBlock({
          status: statusData.status,
          reason: statusData.reason || '',
          suspended_until: statusData.suspended_until || null,
        })
        await supabase.auth.signOut()
        setUser(null)
        return
      }
    } catch {
      // check_user_status 함수 미존재 시 무시
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user as SupabaseUser | undefined ?? null
      setUser(u)
      if (u) handlePostAuth(u.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user as SupabaseUser | undefined ?? null
        setUser(u)
        if (_event === 'SIGNED_IN' && u) {
          supabase!.from('user_profiles')
            .update({ last_sign_in_at: new Date().toISOString() })
            .eq('id', u.id)
            .then(() => {})
          handlePostAuth(u.id)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [handlePostAuth])

  async function signInWithEmail(email: string, password: string): Promise<unknown> {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signInWithGoogle(): Promise<unknown> {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
    return data
  }

  async function signInWithKakao(): Promise<unknown> {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
    return data
  }

  async function signOut(): Promise<void> {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdminUser: isAdmin(user?.email),
    accountBlock,
    clearAccountBlock,
    signInWithEmail,
    signInWithGoogle,
    signInWithKakao,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
