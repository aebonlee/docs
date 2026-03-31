import { useState, useEffect, type ReactElement, type ChangeEvent, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchDocumentById, createDocument, updateDocument } from '../../services/documents'
import { uploadPDF } from '../../utils/storage'
import { categories } from '../../config/site'
import { useToast } from '../../contexts/ToastContext'
import SEOHead from '../../components/SEOHead'
import type { DocumentFormState } from '../../types'

export default function AdminDocumentForm(): ReactElement {
  const { docId } = useParams<{ docId: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const isEdit = !!docId

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<DocumentFormState>({
    slug: '',
    category: 'programming',
    title: '',
    description: '',
    fileName: '',
    fileUrl: '',
    fileSize: '',
    pages: '',
    tags: '',
    addedAt: new Date().toISOString().split('T')[0],
  })
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (!isEdit) return
    async function load(): Promise<void> {
      try {
        const doc = await fetchDocumentById(docId!)
        if (doc) {
          setForm({
            slug: doc.id || '',
            category: doc.category || 'programming',
            title: doc.title || '',
            description: doc.description || '',
            fileName: doc.fileName || '',
            fileUrl: doc.fileUrl || '',
            fileSize: doc.size || '',
            pages: doc.pages != null ? String(doc.pages) : '',
            tags: (doc.tags || []).join(', '),
            addedAt: doc.addedAt || '',
          })
        }
      } catch {
        addToast('문서 불러오기 실패', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [docId, isEdit, addToast])

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setSaving(true)

    try {
      let fileData: { fileName?: string; fileUrl?: string; fileSize?: string } = {}
      if (file) {
        fileData = await uploadPDF(file, form.category)
      }

      const tags = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        slug: form.slug,
        category: form.category,
        title: form.title,
        description: form.description,
        fileName: fileData.fileName || form.fileName,
        fileUrl: fileData.fileUrl || form.fileUrl,
        fileSize: fileData.fileSize || form.fileSize,
        pages: form.pages ? parseInt(form.pages, 10) : null,
        tags,
        addedAt: form.addedAt,
      }

      if (isEdit) {
        await updateDocument(docId!, payload)
        addToast('문서가 수정되었습니다.', 'success')
      } else {
        await createDocument(payload)
        addToast('문서가 생성되었습니다.', 'success')
      }

      navigate('/admin/documents')
    } catch (err) {
      addToast((isEdit ? '수정' : '생성') + ' 실패: ' + (err as Error).message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <SEOHead title={isEdit ? '문서 수정' : '새 문서'} />
        <div className="loading-screen"><div className="loading-spinner" /></div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <SEOHead title={isEdit ? '문서 수정' : '새 문서'} />

      <div className="admin-page-header">
        <h1 className="admin-page-title">{isEdit ? '문서 수정' : '새 문서 등록'}</h1>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">슬러그 (URL ID)</label>
              <input
                type="text"
                name="slug"
                className="admin-form-input"
                value={form.slug}
                onChange={handleChange}
                placeholder="python-basics"
                required
                disabled={isEdit}
              />
              <span className="admin-form-hint">URL에 사용되는 고유 식별자</span>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">카테고리</label>
              <select
                name="category"
                className="admin-form-select"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">제목</label>
            <input
              type="text"
              name="title"
              className="admin-form-input"
              value={form.title}
              onChange={handleChange}
              placeholder="Python 기초 문법 정리"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">설명</label>
            <textarea
              name="description"
              className="admin-form-textarea"
              value={form.description}
              onChange={handleChange}
              placeholder="문서에 대한 간단한 설명"
              rows={3}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">PDF 파일</label>
            <input
              type="file"
              accept=".pdf"
              className="admin-form-input"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {form.fileName && !file && (
              <span className="admin-form-hint">현재 파일: {form.fileName}</span>
            )}
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">페이지 수</label>
              <input
                type="number"
                name="pages"
                className="admin-form-input"
                value={form.pages}
                onChange={handleChange}
                placeholder="45"
                min="0"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">추가일</label>
              <input
                type="date"
                name="addedAt"
                className="admin-form-input"
                value={form.addedAt}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">태그</label>
            <input
              type="text"
              name="tags"
              className="admin-form-input"
              value={form.tags}
              onChange={handleChange}
              placeholder="Python, 기초"
            />
            <span className="admin-form-hint">쉼표로 구분</span>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? '저장 중...' : (isEdit ? '수정' : '등록')}
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin/documents')}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
