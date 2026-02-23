import client from './client'

export const login = (email, password) => {
  return client.post('/auth/login', { email, password })
}

export const signup = (email, password, fullName) => {
  return client.post('/auth/signup', { email, password, name: fullName })
}
