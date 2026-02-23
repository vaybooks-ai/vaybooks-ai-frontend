import client from './client'

export const createFirm = (name, billingToolId) => {
  return client.post('/firms', { name, billingToolId })
}

export const getMyFirm = () => {
  return client.get('/firms/me')
}

export const createEntity = (firmId, name) => {
  return client.post('/entities', { firmId, name })
}
