import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import * as firmsApi from '../api/firms'

const FirmSelector = () => {
  const { selectedFirm, selectFirm, isAuthenticated } = useAuth()
  const [firms, setFirms] = useState([])
  const [selectedFirmData, setSelectedFirmData] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadFirms()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (selectedFirm && firms.length > 0) {
      const firm = firms.find(f => f.id === selectedFirm)
      setSelectedFirmData(firm)
    }
  }, [selectedFirm, firms])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadFirms = async () => {
    setLoading(true)
    try {
      const response = await firmsApi.getFirms()
      setFirms(response.data || [])
    } catch (error) {
      console.error('Failed to load firms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFirmSelect = (firmId) => {
    selectFirm(firmId)
    setIsOpen(false)
  }

  if (!isAuthenticated || loading) {
    return null
  }

  if (firms.length === 0) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-500">Firm</span>
          <span className="text-sm font-medium text-gray-900">
            {selectedFirmData ? selectedFirmData.name : 'Select Firm'}
          </span>
        </div>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase">Your Firms</p>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {firms.map((firm) => (
              <button
                key={firm.id}
                onClick={() => handleFirmSelect(firm.id)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                  selectedFirm === firm.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{firm.name}</p>
                    {firm.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{firm.description}</p>
                    )}
                  </div>
                  {selectedFirm === firm.id && (
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 mt-1">
            <a
              href="/firm-setup"
              className="flex items-center px-4 py-3 text-sm text-primary-600 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Firm
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default FirmSelector
