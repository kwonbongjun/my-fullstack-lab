import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
  const [count, setCount] = useState(0)
  const [backendMessage, setBackendMessage] = useState('')
  const [backendStatus, setBackendStatus] = useState('checking...')

  useEffect(() => {
    // Check backend health
    fetch(`${API_URL}/health`)
      .then(res => res.json())
      .then(data => {
        setBackendStatus(data.status)
      })
      .catch(() => {
        setBackendStatus('offline')
      })

    // Get message from backend
    fetch(`${API_URL}/api/hello`)
      .then(res => res.json())
      .then(data => {
        setBackendMessage(data.message)
      })
      .catch(() => {
        setBackendMessage('Failed to connect to backend')
      })
  }, [])

  const handleSendData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: `Count: ${count}` }),
      })
      const result = await response.json()
      console.log('Backend response:', result)
      alert(`Data sent successfully! Timestamp: ${result.timestamp}`)
    } catch (err) {
      console.error('Error sending data:', err)
      alert('Failed to send data to backend')
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>My Fullstack Lab</h1>
      <div className="card">
        <p>Backend Status: <strong style={{ color: backendStatus === 'ok' ? 'green' : 'red' }}>{backendStatus}</strong></p>
        <p>Backend Message: {backendMessage}</p>
        <hr />
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={handleSendData} style={{ marginLeft: '10px' }}>
          Send Data to Backend
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        A fullstack lab for practicing and building creative web ideas
      </p>
    </>
  )
}

export default App
