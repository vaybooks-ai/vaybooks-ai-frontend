import client from './client'

export const getBillingTools = () => {
  return client.get('/billing-tools')
}

export const getTemplates = (billingToolId, reportType) => {
  return client.get('/templates', { 
    params: { billingToolId, reportType } 
  })
}

export const createTemplate = (data) => {
  return client.post('/templates', data)
}

export const updateTemplate = (id, data) => {
  return client.put(`/templates/${id}`, data)
}

export const testTemplate = (id, file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  return client.post(`/templates/${id}/test`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getFirmReportSettings = () => {
  return client.get('/firm/report-settings')
}

export const updateFirmReportSettings = (reportType, selectedTemplateId) => {
  return client.put('/firm/report-settings', { reportType, selectedTemplateId })
}
