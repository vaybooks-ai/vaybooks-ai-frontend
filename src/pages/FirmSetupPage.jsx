import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as firmsApi from '../api/firms'

const FirmSetupPage = () => {
  const [firmName, setFirmName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Create firm with just the name for now
      await firmsApi.createFirm(firmName)
      // Navigate to upload page instead of template wizard
      navigate('/upload')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create firm')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Setup Your Firm</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firmName" className="block text-sm font-medium text-gray-700 mb-1">
              Firm Name
            </label>
            <input
              id="firmName"
              type="text"
              required
              className="input"
              placeholder="Enter your firm name"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
            />
            <p className="mt-2 text-sm text-gray-500">
              You can add more details later from the settings page
            </p>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Creating...' : 'Continue to Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FirmSetupPage
