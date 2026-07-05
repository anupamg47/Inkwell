import CategoryBadge from './CategoryBadge'
import { togglePin } from '../services/api'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Clean SVG Icons for actions
const CardIcons = {
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22"></line>
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  delete: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
}

export default function NoteCard({ note, onEdit, onDelete, onPinToggle }) {
  const handlePinToggle = async (e) => {
    e.stopPropagation()
    try {
      const updated = await togglePin(note.id)
      onPinToggle(updated)
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit(note)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(note)
  }

  return (
    <article
      className={`note-card ${note.is_pinned ? 'pinned' : ''}`}
      style={{ background: note.color || '#fbf9f4' }}
      onClick={() => onEdit(note)}
      id={`note-card-${note.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onEdit(note)}
      aria-label={`Open note: ${note.title}`}
    >
      {/* Realistic brass clip element on pinned notes */}
      {note.is_pinned && <div className="brass-clip" title="Pinned Note" />}

      <div className="note-card-header">
        <h3 className="note-card-title">
          {note.title || 'Untitled'}
        </h3>
        <div className="note-card-actions">
          <button
            id={`pin-btn-${note.id}`}
            className={`card-action-btn ${note.is_pinned ? 'pin-active' : ''}`}
            onClick={handlePinToggle}
            title={note.is_pinned ? 'Unpin note' : 'Pin note'}
          >
            {CardIcons.pin}
          </button>
          <button
            id={`edit-btn-${note.id}`}
            className="card-action-btn"
            onClick={handleEdit}
            title="Edit note"
          >
            {CardIcons.edit}
          </button>
          <button
            id={`delete-btn-${note.id}`}
            className="card-action-btn danger"
            onClick={handleDelete}
            title="Delete note"
          >
            {CardIcons.delete}
          </button>
        </div>
      </div>

      {note.content && (
        <p className="note-card-content">{note.content}</p>
      )}

      <div className="note-card-footer">
        <div>
          {note.category_detail && <CategoryBadge category={note.category_detail} />}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          <span className="note-card-date">
            {formatDate(note.updated_at)}
          </span>
          {note.word_count > 0 && (
            <span className="note-card-stats">
              {note.word_count} w
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
