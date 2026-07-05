import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ---- Notes ----
export const fetchNotes = (params = {}) =>
  api.get('/notes/', { params }).then(r => r.data)

export const fetchNoteStats = () =>
  api.get('/notes/stats/').then(r => r.data)

export const fetchNote = (id) =>
  api.get(`/notes/${id}/`).then(r => r.data)


export const createNote = (data) =>
  api.post('/notes/', data).then(r => r.data)

export const updateNote = (id, data) =>
  api.patch(`/notes/${id}/`, data).then(r => r.data)

export const deleteNote = (id) =>
  api.delete(`/notes/${id}/`)

export const togglePin = (id) =>
  api.patch(`/notes/${id}/toggle-pin/`).then(r => r.data)

// ---- Categories ----
export const fetchCategories = () =>
  api.get('/categories/').then(r => r.data)

export const createCategory = (data) =>
  api.post('/categories/', data).then(r => r.data)

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}/`)

export default api
