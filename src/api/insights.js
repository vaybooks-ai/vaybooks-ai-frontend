import client from './client'

export const getInsights = (entityId, periodStart, periodEnd) => {
  return client.get('/insights', { 
    params: { entityId, periodStart, periodEnd } 
  })
}

export const getInsight = (id) => {
  return client.get(`/insights/${id}`)
}
