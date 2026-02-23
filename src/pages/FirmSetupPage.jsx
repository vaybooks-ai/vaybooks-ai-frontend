import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as firmsApi from '../api/firms'
import * as templatesApi from '../api/templates'

const FirmSetupPage = () => {
  const [firmName, setFirmName] = useState('')
  const [billingTools, setBillingTools] = useState([])
  const [selectedBillingTool, setSelectedBillingTool] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadBillingTools()
  }, [])

  const loadBillingTools = async () => {
    try {
      const response = await templatesApi.getBillingTools()
      setBillingTools(response.data)
    } catch (err) {
      setError('Failed to load billing tools')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await firmsApi.createFirm(firmName, selectedBillingTool)
      navigate('/template-wizard')
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
          </div>
          
          <div>
            <label htmlFor="billingTool" className="block text-sm font-medium text-gray-700 mb-1">
              Billing/Accounting Software
            </label>
            <select
              id="billingTool"
              required
              className="input"
              value={selectedBillingTool}
              onChange={(e) => setSelectedBillingTool(e.target.value)}
            >
              <option value="">Select your billing software</option>
              {billingTools.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.name} - {tool.description}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              This helps us provide the right CSV templates for your reports
            </p>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Creating...' : 'Continue to Template Setup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FirmSetupPage
