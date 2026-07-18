import api from './api'
export const getRecommendations = () => api.post('/recommend')
