import client from './client'

export const uploadFile = (file, reportType, entityId) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('reportType', reportType)
  formData.append('entityId', entityId)
  
  return client.post('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getUpload = (id) => {
  return client.get(`/uploads/${id}`)
}

export const getUploads = (params) => {
  return client.get('/uploads', { params })
}
