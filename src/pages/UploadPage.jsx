import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import * as uploadsApi from '../api/uploads'
import * as firmsApi from '../api/firms'
import { REPORT_TYPES } from '../utils/constants'

const UploadPage = () => {
  const { selectedFirm } = useAuth()
  const [file, setFile] = useState(null)
  const [reportType, setReportType] = useState('')
  const [firmId, setFirmId] = useState(selectedFirm || '')
  const [firms, setFirms] = useState([])
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    loadFirms()
    if (selectedFirm) {
      setFirmId(selectedFirm)
      loadUploads()
    }
  }, [selectedFirm])

  useEffect(() => {
    if (firmId) {
      loadUploads()
    }
  }, [firmId])

  const loadFirms = async () => {
    try {
      const response = await firmsApi.getFirms()
      setFirms(response.data || [])
    } catch (err) {
      console.error('Failed to load firms:', err)
    }
  }

  const loadUploads = async () => {
    if (!firmId) return
    
    setLoading(true)
    try {
      const response = await uploadsApi.getUploads(firmId)
      setUploads(response.data || [])
    } catch (err) {
      console.error('Failed to load uploads:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0])
    }
  }

  const handleFileSelection = (selectedFile) => {
    setError('')
    setSuccess('')
    
    // Validate file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ]
    const validExtensions = ['.xlsx', '.xls', '.csv']
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase()
    
    if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension)) {
      setError('Invalid file type. Please upload Excel (.xlsx, .xls) or CSV files only.')
      return
    }
    
    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024
    if (selectedFile.size > maxSize) {
      setError('File size exceeds 10MB limit. Please compress your file and try again.')
      return
    }
    
    setFile(selectedFile)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!file) {
      setError('Please select a file to upload')
      return
    }
    
    if (!reportType) {
      setError('Please select a report type')
      return
    }
    
    if (!firmId) {
      setError('Please select a firm')
      return
    }
    
    setUploading(true)
    setUploadProgress(0)
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)
    
    try {
      await uploadsApi.uploadFile(file, reportType, firmId)
      setUploadProgress(100)
      setSuccess('✓ File uploaded and processing started successfully!')
      setFile(null)
      setReportType('')
      loadUploads()
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess('')
        setUploadProgress(0)
      }, 3000)
    } catch (err) {
      clearInterval(progressInterval)
      setUploadProgress(0)
      const errorMessage = err.response?.data?.message || 'Failed to upload file. Please try again.'
      setError(`❌ ${errorMessage}`)
    } finally {
      clearInterval(progressInterval)
      setUploading(false)
    }
  }

  const handleDelete = async (uploadId) => {
    if (!confirm('Are you sure you want to delete this upload?')) {
      return
    }
    
    try {
      await uploadsApi.deleteUpload(uploadId)
      setSuccess('✓ Upload deleted successfully')
      loadUploads()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(`❌ ${err.response?.data?.message || 'Failed to delete upload'}`)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ Processing' },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: '✓ Completed' },
      FAILED: { bg: 'bg-red-100', text: 'text-red-800', label: '✗ Failed' }
    }
    const badge = badges[status] || badges.PENDING
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Financial Report</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload your Excel or CSV files to analyze financial data and generate insights
        </p>
      </div>

      {/* Upload Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Firm Selection */}
          <div>
            <label htmlFor="firm" className="block text-sm font-medium text-gray-700 mb-2">
              Select Firm <span className="text-red-500">*</span>
            </label>
            <select
              id="firm"
              value={firmId}
              onChange={(e) => setFirmId(e.target.value)}
              className="input"
              required
            >
              <option value="">Choose a firm...</option>
              {firms.map((firm) => (
                <option key={firm.id} value={firm.id}>
                  {firm.name}
                </option>
              ))}
            </select>
          </div>

          {/* Report Type Selection */}
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-2">
              Report Type <span className="text-red-500">*</span>
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input"
              required
            >
              <option value="">Choose report type...</option>
              {REPORT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File <span className="text-red-500">*</span>
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary-500 bg-primary-50'
                  : file
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                disabled={uploading}
              />
              
              {!file ? (
                <label htmlFor="file-upload" className="cursor-pointer">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-primary-600 hover:text-primary-500">Click to browse</span>
                    {' '}or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Excel (.xlsx, .xls) or CSV files (max 10MB)
                  </p>
                </label>
              ) : (
                <div className="space-y-2">
                  <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  {!uploading && (
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Remove file
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uploading...</span>
                <span className="font-medium text-gray-900">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setFile(null)
                setReportType('')
                setError('')
                setSuccess('')
              }}
              className="btn btn-secondary"
              disabled={uploading}
            >
              Clear
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading || !file || !reportType || !firmId}
            >
              {uploading ? 'Uploading...' : 'Upload Report →'}
            </button>
          </div>
        </form>
      </div>

      {/* Recent Uploads */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Uploads</h2>
          <button
            onClick={loadUploads}
            className="text-sm text-primary-600 hover:text-primary-700"
            disabled={loading}
          >
            {loading ? 'Loading...' : '↻ Refresh'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading uploads...</p>
          </div>
        ) : uploads.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No uploads yet</p>
            <p className="text-xs text-gray-400">Upload your first report to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {uploads.map((upload) => (
                  <tr key={upload.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {upload.fileName || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {REPORT_TYPES.find(t => t.value === upload.reportType)?.label || upload.reportType}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(upload.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getStatusBadge(upload.status)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() => handleDelete(upload.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadPage
