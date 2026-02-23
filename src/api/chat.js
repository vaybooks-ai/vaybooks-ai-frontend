import client from './client'

export const createChatSession = (entityId) => {
  return client.post('/chat/sessions', { entityId })
}

export const getChatSessions = (entityId) => {
  return client.get('/chat/sessions', { params: { entityId } })
}

export const sendMessage = (sessionId, content) => {
  return client.post('/chat/messages', { sessionId, content })
}

export const getMessages = (sessionId) => {
  return client.get(`/chat/sessions/${sessionId}/messages`)
}
