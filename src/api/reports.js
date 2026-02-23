import client from './client'

export const generateMonthlyReport = (entityId, month, year) => {
  return client.post('/reports/monthly', { entityId, month, year })
}
