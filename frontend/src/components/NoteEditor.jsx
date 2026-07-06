import { useState, useEffect, useRef } from 'react'
import { createNote, updateNote } from '../services/api'

// Realistic archival stationery papers
const NOTE_COLORS = [
  { label: 'Natural Ivory',  value: '#fbf9f4' },
  { label: 'Archival Cream', value: '#f4f0e6' },
  { label: 'Ledger Slate',   value: '#e6eaed' },
  { label: 'Sage Leaf',      value: '#e8ede8' },
  { label: 'Archival Rose',  value: '#f2ebeb' },
  { label: 'Warm Biscuit',   value: '#f5eee6' },
]

const DEFAULT_NOTE = {
  title: '',
  content: '',
  category: '',
  color: '#fbf9f4',
  is_pinned: false,
}

export default function NoteEditor({ note, categories, onSave, onClose }) {
  const isEdit = Boolean(note?.id)
  const [form, setForm] = useState(DEFAULT_NOTE)
  const [saving, setSaving] = useState(false)
  const titleRef = useRef(null)

  useEffect(() => {
    if (note) {
      setForm({
        title: note.title || '',
        content: note.content || '',
        category: note.category || '',
        color: note.color || '#fbf9f4',
        is_pinned: note.is_pinned || false,
      })
    } else {
      setForm(DEFAULT_NOTE)
    }
    setTimeout(() => titleRef.current?.focus(), 80)
  }, [note])

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content,
        category: form.category || null,
        color: form.color,
        is_pinned: form.is_pinned,
      }
      const saved = isEdit
        ? await updateNote(note.id, payload)
        : await createNote(payload)
      onSave(saved, isEdit)
    } catch (err) {
      console.error(err)
      alert('Failed to save note sheet: ' + (err.response?.data?.detail || err.message || 'Please check your connection and passkey.'))
    } finally {
      setSaving(false)
    }
  }

  const wordCount = form.content.split(/\s+/).filter(Boolean).length
  const charCount = form.content.length

  return (
    <div
      className="editor-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Edit note' : 'Create note'}
    >
      <div className="editor-modal" style={{ background: form.color }}>
        {/* Header */}
        <div className="editor-header">
          <div className="editor-header-left">
            <h2>{isEdit ? 'Edit Note Sheet' : 'New Note Sheet'}</h2>
            <p>{isEdit && note?.updated_at ? `Last revised · ${new Date(note.updated_at).toLocaleDateString()}` : 'Archival journal entry'}</p>
          </div>
          <button
            id="editor-close-btn"
            className="editor-close-btn"
            onClick={onClose}
            title="Close"
          >✕</button>
        </div>

        {/* Body */}
        <div className="editor-body">
          {/* Title */}
          <div className="editor-field">
            <label htmlFor="note-title">Title</label>
            <input
              id="note-title"
              name="inkwell_note_title_no_autofill"
              ref={titleRef}
              className="editor-input"
              type="text"
              placeholder="Entry heading..."
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && document.getElementById('note-content')?.focus()}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="true"
            />

          </div>

          {/* Content */}
          <div className="editor-field">
            <label htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              className="editor-textarea"
              placeholder="Record your thoughts or observations..."
              value={form.content}
              onChange={e => handleChange('content', e.target.value)}
            />
            <div className="editor-stats">
              {wordCount} words · {charCount} chars
            </div>
          </div>

          {/* Category & Pin */}
          <div className="editor-row">
            <div className="editor-field">
              <label htmlFor="note-category">Index Tag</label>
              <select
                id="note-category"
                className="editor-select"
                value={form.category}
                onChange={e => handleChange('category', e.target.value)}
              >
                <option value="">Uncategorized</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="editor-field">
              <label>Brass Pin</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
                <button
                  id="pin-toggle-btn"
                  type="button"
                  onClick={() => handleChange('is_pinned', !form.is_pinned)}
                  style={{
                    padding: '7px 14px',
                    border: `1px solid ${form.is_pinned ? 'var(--gold-dim)' : 'rgba(0,0,0,0.18)'}`,
                    borderRadius: 'var(--radius-sm)',
                    background: form.is_pinned ? 'rgba(200, 169, 106, 0.18)' : 'rgba(255,255,255,0.8)',
                    color: form.is_pinned ? '#8c7343' : 'var(--ink-600)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.78rem',
                    fontWeight: form.is_pinned ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="17" x2="12" y2="22"></line>
                    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                  </svg>
                  {form.is_pinned ? 'Pinned to Top' : 'Pin to Top'}
                </button>
              </div>
            </div>
          </div>

          {/* Color picker */}
          <div className="editor-field">
            <label>Archival Paper Tone</label>
            <div className="color-picker-row">
              {NOTE_COLORS.map(c => (
                <button
                  key={c.value}
                  id={`color-swatch-${c.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`color-swatch ${form.color === c.value ? 'selected' : ''}`}
                  style={{ background: c.value }}
                  onClick={() => handleChange('color', c.value)}
                  title={c.label}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="editor-footer">
          <button id="editor-cancel-btn" type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            id="editor-save-btn"
            type="button"
            className="btn-save"
            onClick={handleSave}
            disabled={saving || !form.title.trim()}
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Entry'}
          </button>
        </div>
      </div>
    </div>
  )
}
