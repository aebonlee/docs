import { supabase } from '../utils/supabase'
import {
  documents as staticDocuments,
  getDocumentsByCategory as staticByCategory,
  getDocumentById as staticById,
  searchDocuments as staticSearch,
} from '../data/documents'
import { categories } from '../config/site'
import type { Document, DocumentRow, DocumentPayload, DocumentUpdate } from '../types'

function mapRow(row: DocumentRow): Document {
  return {
    id: row.slug,
    category: row.category,
    title: row.title,
    description: row.description || '',
    fileName: row.file_name,
    fileUrl: row.file_url,
    pages: row.pages,
    size: row.file_size || undefined,
    tags: row.tags || [],
    addedAt: row.added_at || undefined,
  }
}

export async function fetchDocuments(): Promise<Document[]> {
  if (!supabase) return staticDocuments

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('added_at', { ascending: false })

  if (error) {
    console.warn('Supabase fetch failed, using static data:', error.message)
    return staticDocuments
  }
  return (data as DocumentRow[]).map(mapRow)
}

export async function fetchDocumentsByCategory(categoryId: string): Promise<Document[]> {
  if (!supabase) return staticByCategory(categoryId)

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('category', categoryId)
    .order('added_at', { ascending: false })

  if (error) {
    console.warn('Supabase fetch failed, using static data:', error.message)
    return staticByCategory(categoryId)
  }
  return (data as DocumentRow[]).map(mapRow)
}

export async function fetchDocumentById(id: string): Promise<Document | undefined> {
  if (!supabase) return staticById(id)

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('slug', id)
    .single()

  if (error) {
    console.warn('Supabase fetch failed, using static data:', error.message)
    return staticById(id)
  }
  return mapRow(data as DocumentRow)
}

export async function searchDocumentsAsync(query: string): Promise<Document[]> {
  if (!supabase) return staticSearch(query)

  const q = query.toLowerCase()
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    .order('added_at', { ascending: false })

  if (error) {
    console.warn('Supabase search failed, using static data:', error.message)
    return staticSearch(query)
  }
  return (data as DocumentRow[]).map(mapRow)
}

export async function fetchCategoryCounts(): Promise<Record<string, number>> {
  if (!supabase) {
    const counts: Record<string, number> = {}
    for (const cat of categories) {
      counts[cat.id] = staticByCategory(cat.id).length
    }
    return counts
  }

  const { data, error } = await supabase
    .from('documents')
    .select('category')

  if (error) {
    console.warn('Supabase count failed, using static data:', error.message)
    const counts: Record<string, number> = {}
    for (const cat of categories) {
      counts[cat.id] = staticByCategory(cat.id).length
    }
    return counts
  }

  const counts: Record<string, number> = {}
  for (const cat of categories) {
    counts[cat.id] = 0
  }
  for (const row of data as { category: string }[]) {
    if (counts[row.category] !== undefined) {
      counts[row.category]++
    }
  }
  return counts
}

export async function createDocument(doc: DocumentPayload): Promise<Document> {
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('documents')
    .insert({
      slug: doc.slug,
      category: doc.category,
      title: doc.title,
      description: doc.description || '',
      file_name: doc.fileName,
      file_url: doc.fileUrl,
      file_size: doc.fileSize || '',
      pages: doc.pages || null,
      tags: doc.tags || [],
      added_at: doc.addedAt || new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  if (error) throw error
  return mapRow(data as DocumentRow)
}

export async function updateDocument(id: string, doc: DocumentUpdate): Promise<Document> {
  if (!supabase) throw new Error('Supabase not configured')

  const updates: Record<string, unknown> = {}
  if (doc.slug !== undefined) updates.slug = doc.slug
  if (doc.category !== undefined) updates.category = doc.category
  if (doc.title !== undefined) updates.title = doc.title
  if (doc.description !== undefined) updates.description = doc.description
  if (doc.fileName !== undefined) updates.file_name = doc.fileName
  if (doc.fileUrl !== undefined) updates.file_url = doc.fileUrl
  if (doc.fileSize !== undefined) updates.file_size = doc.fileSize
  if (doc.pages !== undefined) updates.pages = doc.pages
  if (doc.tags !== undefined) updates.tags = doc.tags
  if (doc.addedAt !== undefined) updates.added_at = doc.addedAt

  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('slug', id)
    .select()
    .single()

  if (error) throw error
  return mapRow(data as DocumentRow)
}

export async function deleteDocument(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('slug', id)

  if (error) throw error
}

export async function deleteDocuments(ids: string[]): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')

  const { error } = await supabase
    .from('documents')
    .delete()
    .in('slug', ids)

  if (error) throw error
}

export async function seedDocuments(docs: Document[]): Promise<Document[]> {
  if (!supabase) throw new Error('Supabase not configured')

  const rows = docs.map((doc) => ({
    slug: doc.id,
    category: doc.category,
    title: doc.title,
    description: doc.description || '',
    file_name: doc.fileName || '',
    file_url: doc.fileUrl || '',
    file_size: doc.size || '',
    pages: doc.pages || null,
    tags: doc.tags || [],
    added_at: doc.addedAt || new Date().toISOString().split('T')[0],
  }))

  const { data, error } = await supabase
    .from('documents')
    .upsert(rows, { onConflict: 'slug' })
    .select()

  if (error) throw error
  return (data as DocumentRow[]).map(mapRow)
}
