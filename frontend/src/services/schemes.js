import api from './api'
export const getSchemes = (params) => api.get('/schemes', { params })
export const getSchemeById = (id) => api.get(`/schemes/${id}`)
