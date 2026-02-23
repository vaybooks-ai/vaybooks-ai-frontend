import { useState, useEffect } from 'react'
import * as uploadsApi from '../api/uploads'
import * as firmsApi from '../api/firms'
import { REPORT_TYPES } from '../utils/constants'

const UploadPage = () => {
  const [file, setFile] = useState(null)
  const [reportType, setReportType] = useState('')
  const [firms, setFirms] = useState([])
  const [selectedFirm, setSelectedFirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploads, setUploads] = useState([])

  useEffect(() => {
    loadFirms()
    loadUploads()
  }, [])

  const loadFirms = async () => {
    try {
      const response = await firmsApi.getFirms()
      setFirms(response.data)
      if (response.data.length > 0) {
        setSelectedFirm(response.data[0].id)
      }
    } catch (err) {
      setError('Failed to load firms')
    }
  }

  const loadUploads = async () => {
    try {
      const response = await uploadsApi.getUploads()
      setUploads(response.data)
    } catch (err) {
      console.error('Failed to load uploads:', err)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Validate file type
      const validTypes = ['.xlsx', '.xls', '.csv']
      const fileExt = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase()
      if (!validTypes.includes(fileExt)) {
        setError('Please select a valid file (.xlsx, .xls, or .csv)')
        setFile(null)
        return
      }
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        setFile(null)
        return
      }
      setFile(selectedFile)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !reportType || !selectedFirm) {
      setError('Please fill in all fields')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await uploadsApi.uploadFile(file, reportType, selectedFirm)
      setSuccess('File uploaded and processed successfully!')
      setFile(null)
      setReportType('')
      // Reset file input
      e.target.reset()
      // Reload uploads list
      loadUploads()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (uploadId) => {
    if (!confirm('Are you sure you want to delete this upload?')) return

    try {
      await uploadsApi.deleteUpload(uploadId)
      setSuccess('Upload deleted successfully')
      loadUploads()
    } catch (err) {
      setError('Failed to delete upload')
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Upload Form */}
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Files</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firm" className="block text-sm font-medium text-gray-700 mb-1">
              Select Firm
            </label>
            <select
              id="firm"
              required
              className="input"
              value={selectedFirm}
              onChange={(e) => setSelectedFirm(e.target.value)}
            >
              <option value="">Select a firm</option>
              {firms.map((firm) => (
                <option key={firm.id} value={firm.id}>
                  {firm.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              id="reportType"
              required
              className="input"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="">Select report type</option>
              {REPORT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Select File
            </label>
            <input
              id="file"
              type="file"
              required
              accept=".xlsx,.xls,.csv"
              className="input"
              onChange={handleFileChange}
            />
            <p className="mt-2 text-sm text-gray-500">
              Supported formats: Excel (.xlsx, .xls) or CSV (.csv). Max size: 10MB
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !file}
              className="btn btn-primary"
            >
              {loading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </form>
      </div>

      {/* Uploads List */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Uploads</h2>
        
        {uploads.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No uploads yet. Upload your first file above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {uploads.map((upload) => (
                  <tr key={upload.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {upload.fileName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {upload.reportType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        upload.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        upload.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {upload.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(upload.uploadedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(upload.id)}
                        className="text-red-600 hover:text-red-900"
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
