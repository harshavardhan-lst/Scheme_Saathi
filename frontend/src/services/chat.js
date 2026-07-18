import api from './api'
export const sendMessage = (message) => api.post('/chat', { message })
export const checkEligibility = (scheme_id) => api.post('/eligibility', { scheme_id })
export const explainScheme = (scheme_id, language) => api.post('/explain', { scheme_id, language })
export const getChecklist = (scheme_id) => api.get(`/documents/${scheme_id}`)
export const updateChecklistItem = (scheme_id, document_name, status) =>
  api.put(`/documents/${scheme_id}`, { document_name, status })
