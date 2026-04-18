import { createContext, useContext, useState, useEffect, useCallback, type ReactElement, type ReactNode } from 'react'
import { supabase, setSharedSession, getSharedSession, clearSharedSession } from '../utils/supabase'
import { isAdmin } from '../config/admin'
import type { AuthContextValue, AccountBlock, SupabaseUser } from '../types'
import { useIdleTimeout } from '../hooks/useIdleTimeout';
import ProfileCompleteModal from '../components/ProfileCompleteModal';

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
  const [_userProfile, _setUserProfile] = useState<any>(null)

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

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user as SupabaseUser | undefined ?? null
      setUser(u)
      if (u) handlePostAuth(u.id)
      if (!u) {
        const rt = getSharedSession()
        if (rt) {
          try {
            const { data } = await supabase!.auth.refreshSession({ refresh_token: rt })
            if (!data.session) clearSharedSession()
          } catch { clearSharedSession() }
        }
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user as SupabaseUser | undefined ?? null
        setUser(u)
        if (session?.refresh_token) setSharedSession(session.refresh_token)
        if (_event === 'SIGNED_OUT') clearSharedSession()
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

  // 10분 무동작 세션 타임아웃
  useIdleTimeout({
    enabled: !!user,
    onTimeout: () => {
      clearSharedSession();
    },
  });

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
    const { error } = await supabase?.auth.signOut()
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

  // ─── 프로필 완성 체크 ───
  const _loadUserProfile = useCallback(async (uid: string) => {
    try {
      const { data } = await supabase!.from('user_profiles').select('name,phone').eq('id', uid).maybeSingle();
      _setUserProfile(data);
    } catch { _setUserProfile(null); }
  }, []);
  useEffect(() => { if (user) _loadUserProfile(user.id); }, [user, _loadUserProfile]);
  const refreshProfile = useCallback(async () => { if (user) await _loadUserProfile(user.id); }, [user, _loadUserProfile]);
  const needsProfileCompletion = !!user && !!_userProfile && (!_userProfile.name || !_userProfile.phone);

  return (
    <AuthContext.Provider value={value}>
      {children}
      {needsProfileCompletion && user && (
        <ProfileCompleteModal user={user as any} onComplete={refreshProfile} />
      )}
    </AuthContext.Provider>
  )
}
