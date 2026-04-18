/**
 * auth.ts — 프로필 업데이트 헬퍼
 */
import { supabase } from './supabase';

/** 프로필 업데이트 */
export async function updateProfile(
  userId: string,
  updates: Record<string, unknown>
): Promise<any> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
