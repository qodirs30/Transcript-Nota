import { useState, useCallback } from 'react'
import AuthGatePage from './pages/AuthGatePage'
import TranscriptionPage from './pages/TranscriptionPage'
import HistoryPage from './pages/HistoryPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState<'transcription' | 'history'>('transcription')

  const handleAccessGranted = useCallback(() => {
    setIsAuthenticated(true)
  }, [])

  return (
    <div className="min-h-screen">
      {isAuthenticated ? (
        currentView === 'transcription' ? (
          <TranscriptionPage onGoToHistory={() => setCurrentView('history')} />
        ) : (
          <HistoryPage onBack={() => setCurrentView('transcription')} />
        )
      ) : (
        <AuthGatePage onAccessGranted={handleAccessGranted} />
      )}
    </div>
  )
}

export default App
