import { useState } from 'react'

// Sleek SVG Icons
const Icons = {
  quill: (
    <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
      <path d="M2 2l7.586 7.586"></path>
      <circle cx="11" cy="11" r="2"></circle>
    </svg>
  ),
  search: (
    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  all: (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  pinned: (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22"></line>
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
    </svg>
  ),
  folder: (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  newNote: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
}

export default function Sidebar({
  categories,
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  stats = {},
  onNewNote,
  isOpen,
  onClose,
}) {
  // Exact global counts fetched directly from PostgreSQL stats endpoint
  const totalNotes = stats.total_count ?? 0
  const pinnedCount = stats.pinned_count ?? 0
  const uncategorizedCount = stats.uncategorized_count ?? 0

  const handleFilterClick = (filter) => {
    setActiveFilter(filter)
    if (onClose) onClose() // Automatically close drawer on mobile after selecting a filter
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-left">
            <h1>
              {Icons.quill}
              Inkwell
            </h1>
            <div className="brand-subtitle">Executive Diary</div>
          </div>
          <button
            id="sidebar-close-btn"
            className="sidebar-close-btn"
            onClick={onClose}
            title="Close menu"
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <div className="search-input-wrap">
            {Icons.search}
            <input
              id="search-notes"
              name="inkwell_search_no_autofill"
              className="search-input"
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
            />

          </div>
        </div>

        {/* Main Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">Ledger Views</div>
          <button
            id="filter-all"
            className={`nav-item ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterClick('all')}
          >
            {Icons.all}
            All Notes
            <span className="nav-count">{totalNotes}</span>
          </button>
          <button
            id="filter-pinned"
            className={`nav-item ${activeFilter === 'pinned' ? 'active' : ''}`}
            onClick={() => handleFilterClick('pinned')}
          >
            {Icons.pinned}
            Pinned
            <span className="nav-count">{pinnedCount}</span>
          </button>
          <button
            id="filter-uncategorized"
            className={`nav-item ${activeFilter === 'uncategorized' ? 'active' : ''}`}
            onClick={() => handleFilterClick('uncategorized')}
          >
            {Icons.folder}
            Uncategorized
            <span className="nav-count">{uncategorizedCount}</span>
          </button>

          {/* Categories */}
          {categories.length > 0 && (
            <>
              <div className="nav-section-title" style={{ marginTop: '8px' }}>Index & Tags</div>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  id={`filter-cat-${cat.id}`}
                  className={`category-nav-item ${activeFilter === `cat-${cat.id}` ? 'active' : ''}`}
                  onClick={() => handleFilterClick(`cat-${cat.id}`)}
                >
                  <span className="category-dot" style={{ background: cat.color }} />
                  {cat.name}
                  <span className="nav-count">{cat.note_count}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            id="new-note-btn"
            className="new-note-btn"
            onClick={() => {
              onNewNote()
              if (onClose) onClose()
            }}
          >
            {Icons.newNote}
            New Note
          </button>
        </div>
      </aside>
    </>
  )
}
