import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import FirmSetupPage from './pages/FirmSetupPage'
import TemplateWizardPage from './pages/TemplateWizardPage'
import UploadPage from './pages/UploadPage'
import InsightsPage from './pages/InsightsPage'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected routes with layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="firm-setup" element={<FirmSetupPage />} />
            <Route path="template-wizard" element={<TemplateWizardPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="insights" element={<InsightsPage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
