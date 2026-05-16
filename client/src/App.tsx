import { useState, useCallback } from 'react'
import AuthGatePage from './pages/AuthGatePage'
import TranscriptionPage from './pages/TranscriptionPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleAccessGranted = useCallback(() => {
    setIsAuthenticated(true)
  }, [])

  return (
    <div className="min-h-screen">
      {isAuthenticated ? (
        <TranscriptionPage />
      ) : (
        <AuthGatePage onAccessGranted={handleAccessGranted} />
      )}
    </div>
  )
}

export default App
