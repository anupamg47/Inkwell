import NoteCard from './NoteCard'
import EmptyState from './EmptyState'

export default function NoteGrid({ notes, loading, filter, onEdit, onDelete, onPinToggle, onNewNote }) {
  if (loading) {
    return (
      <div className="notes-grid">
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      </div>
    )
  }

  if (!notes.length) {
    const emptyType = filter.startsWith('cat-') ? 'category'
                    : filter === 'search' ? 'search'
                    : filter
    return (
      <div className="notes-grid">
        <EmptyState filter={emptyType} onNewNote={onNewNote} />
      </div>
    )
  }

  const pinned = notes.filter(n => n.is_pinned)
  const unpinned = notes.filter(n => !n.is_pinned)

  return (
    <>
      {pinned.length > 0 && (
        <div className="pinned-section">
          <div className="section-label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="17" x2="12" y2="22"></line>
              <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
            </svg>
            Pinned Entries
          </div>
          <div className="notes-grid">
            {pinned.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
                onPinToggle={onPinToggle}
              />
            ))}
          </div>
        </div>
      )}

      {unpinned.length > 0 && (
        <div>
          {pinned.length > 0 && (
            <div className="section-label" style={{ marginBottom: 12 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Standard Entries
            </div>
          )}
          <div className="notes-grid">
            {unpinned.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
                onPinToggle={onPinToggle}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
