import { supabase } from './supabase'
import type { UploadResult } from '../types'

const BUCKET = 'documents'

export async function uploadPDF(file: File, category: string): Promise<UploadResult> {
  if (!supabase) throw new Error('Supabase not configured')

  const ext = file.name.split('.').pop()
  const fileName = `${category}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    })

  if (error) throw error

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName)

  return {
    fileName,
    fileUrl: data.publicUrl,
    fileSize: formatFileSize(file.size),
  }
}

export async function deletePDF(fileName: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([fileName])

  if (error) throw error
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
  return (bytes / (1024 * 1024)).toFixed(1) + 'MB'
}
