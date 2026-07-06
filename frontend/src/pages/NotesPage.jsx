import { useState, useEffect, useCallback, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import NoteGrid from '../components/NoteGrid'
import NoteEditor from '../components/NoteEditor'
import LockScreen from '../components/LockScreen'
import { fetchNotes, fetchCategories, fetchNoteStats, deleteNote, fetchAuthStatus, logoutSite } from '../services/api'

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({ total_count: 0, pinned_count: 0, uncategorized_count: 0 })
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editorNote, setEditorNote] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toasts, setToasts] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [authStatus, setAuthStatus] = useState({ is_protected: true, is_unlocked: false, loading: true })
  const searchTimer = useRef(null)

  // -- Toast --
  const addToast = (msg, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }

  // -- Load exact global stats --
  const loadStats = async () => {
    try {
      const data = await fetchNoteStats()
      setStats(data)
    } catch (e) {
      console.error('Failed to load note stats:', e)
    }
  }

  // -- Load notes --
  const loadNotes = useCallback(async (search = '') => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (activeFilter === 'pinned') params.pinned = 'true'
      if (activeFilter === 'uncategorized') params.category = 'uncategorized'
      if (activeFilter.startsWith('cat-')) {
        params.category = activeFilter.replace('cat-', '')
      }
      const data = await fetchNotes(params)
      setNotes(Array.isArray(data) ? data : (data.results || []))
    } catch (e) {
      console.error(e)
      addToast('Failed to load ledger notes', 'error')
    } finally {
      setLoading(false)
    }
  }, [activeFilter])

  // -- Load categories --
  const loadCategories = async () => {
    try {
      const data = await fetchCategories()
      setCategories(Array.isArray(data) ? data : (data.results || []))
    } catch (e) {
      console.error(e)
    }
  }

  const checkAuth = async () => {
    try {
      const status = await fetchAuthStatus()
      setAuthStatus({ ...status, loading: false })
      if (status.is_unlocked) {
        loadCategories()
        loadStats()
      }
    } catch (e) {
      console.error('Failed to check auth status:', e)
      setAuthStatus({ is_protected: true, is_unlocked: false, loading: false })
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (!authStatus.is_unlocked) return
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      loadNotes(searchQuery)
    }, 300)
    return () => clearTimeout(searchTimer.current)
  }, [searchQuery, activeFilter, loadNotes, authStatus.is_unlocked])

  // -- Editor --
  const openNew = () => { setEditorNote(null); setIsEditorOpen(true) }
  const openEdit = (note) => { setEditorNote(note); setIsEditorOpen(true) }
  const closeEditor = () => { setIsEditorOpen(false); setEditorNote(null) }

  const handleSaved = (savedNote, isEdit) => {
    if (isEdit) {
      setNotes(ns => ns.map(n => n.id === savedNote.id ? savedNote : n))
      addToast('Note revised successfully')
    } else {
      setNotes(ns => [savedNote, ...ns])
      addToast('New note sheet added')
    }
    loadCategories()
    loadStats()
    closeEditor()
  }

  const handlePinToggle = (updated) => {
    setNotes(ns => ns.map(n => n.id === updated.id ? updated : n))
    addToast(updated.is_pinned ? 'Brass clip attached (Pinned)' : 'Brass clip removed')
    loadStats()
  }

  // -- Delete --
  const requestDelete = (note) => setDeleteTarget(note)
  const cancelDelete = () => setDeleteTarget(null)
  const confirmDelete = async () => {
    try {
      await deleteNote(deleteTarget.id)
      setNotes(ns => ns.filter(n => n.id !== deleteTarget.id))
      addToast('Note sheet removed')
      loadCategories()
      loadStats()
    } catch (e) {
      addToast('Failed to remove note', 'error')
    }
    setDeleteTarget(null)
  }

  // -- Header meta --
  const filterLabel = () => {
    if (activeFilter === 'all') return 'All Entries'
    if (activeFilter === 'pinned') return 'Pinned Entries'
    if (activeFilter === 'uncategorized') return 'Uncategorized'
    const cat = categories.find(c => `cat-${c.id}` === activeFilter)
    return cat ? cat.name : 'Entries'
  }

  const effectiveFilter = searchQuery ? 'search' : activeFilter

  if (!authStatus.loading && authStatus.is_protected && !authStatus.is_unlocked) {
    return (
      <LockScreen
        onUnlocked={() => {
          setAuthStatus(s => ({ ...s, is_unlocked: true }))
          loadCategories()
          loadStats()
          loadNotes()
        }}
      />
    )
  }

  return (
    <div className="app-layout">
      <Sidebar
        categories={categories}
        activeFilter={activeFilter}
        setActiveFilter={(f) => { setActiveFilter(f); setSearchQuery('') }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stats={stats}
        onCategoryAdded={(cat) => { setCategories(cs => [...cs, cat]); loadNotes() }}
        onNewNote={openNew}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="main-header-left">
            <button
              id="mobile-menu-btn"
              className="mobile-menu-btn"
              onClick={() => setIsSidebarOpen(true)}
              title="Open menu"
              aria-label="Open navigation menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div>
              <h1 className="main-header-title">
                {searchQuery ? `"${searchQuery}"` : filterLabel()}
              </h1>
              <p className="main-header-meta">
                {loading ? 'Reading ledger...' : `${notes.length} note sheet${notes.length !== 1 ? 's' : ''}`}
                {searchQuery && ' found'}
              </p>
            </div>
          </div>
          <div className="header-actions">
            {authStatus.is_protected && (
              <button
                id="header-lock-btn"
                type="button"
                className="btn-cancel"
                style={{ width: 'auto', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={async () => {
                  try {
                    await logoutSite()
                  } catch (e) {}
                  setAuthStatus(s => ({ ...s, is_unlocked: false }))
                  addToast('Desk locked securely')
                }}
                title="Lock Confidential Desk"
              >
                🔒 Lock Desk
              </button>
            )}
            <button
              id="header-new-note-btn"
              type="button"
              className="new-note-btn"
              style={{ width: 'auto', padding: '7px 16px' }}
              onClick={openNew}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              New Note
            </button>
          </div>
        </header>

        {/* Notes area */}
        <div className="notes-area">
          <NoteGrid
            notes={notes}
            loading={loading}
            filter={effectiveFilter}
            onEdit={openEdit}
            onDelete={requestDelete}
            onPinToggle={handlePinToggle}
            onNewNote={openNew}
          />
        </div>
      </main>

      {/* Editor Modal */}
      {isEditorOpen && (
        <NoteEditor
          note={editorNote}
          categories={categories}
          onSave={handleSaved}
          onClose={closeEditor}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="delete-confirm-overlay" onClick={e => e.target === e.currentTarget && cancelDelete()}>
          <div className="delete-confirm-box">
            <svg className="delete-confirm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <h3>Discard Note Sheet?</h3>
            <p>
              "<strong>{deleteTarget.title}</strong>" will be permanently removed from your desk ledger.
            </p>
            <div className="delete-confirm-actions">
              <button id="cancel-delete-btn" type="button" className="btn-cancel" onClick={cancelDelete}>Keep Sheet</button>
              <button id="confirm-delete-btn" type="button" className="btn-danger" onClick={confirmDelete}>Discard</button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  )
}
