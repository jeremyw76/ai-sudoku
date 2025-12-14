import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

function Home() {
  const [backendStatus, setBackendStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Test backend connection
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setBackendStatus(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Backend connection error:', err)
        setBackendStatus({ error: 'Backend not connected' })
        setLoading(false)
      })
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to Full-Stack App</h1>
        <p className="subtitle">Built with React 19.2.1 + Vite and Node.js + Express</p>
      </header>

      <main className="app-main">
        <section className="status-section">
          <h2>System Status</h2>
          {loading ? (
            <div className="status-loading">
              <p>Checking backend connection...</p>
            </div>
          ) : backendStatus ? (
            <div className="status-card">
              {backendStatus.error ? (
                <div className="status-error">
                  <p>⚠️ {backendStatus.error}</p>
                  <p className="status-hint">Make sure the backend server is running on port 5000</p>
                </div>
              ) : (
                <div className="status-success">
                  <p className="status-indicator">✅ Backend Connected</p>
                  <div className="status-details">
                    <p><strong>Status:</strong> {backendStatus.status}</p>
                    <p><strong>Message:</strong> {backendStatus.message}</p>
                    <p><strong>Timestamp:</strong> {new Date(backendStatus.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </section>

        <section className="info-section">
          <h2>Tech Stack</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <h3>Frontend</h3>
              <ul>
                <li>React 19.2.1</li>
                <li>Vite 6.0.5</li>
                <li>Modern ES6+</li>
              </ul>
            </div>
            <div className="tech-card">
              <h3>Backend</h3>
              <ul>
                <li>Node.js 22.18.0</li>
                <li>Express 4.21.1</li>
                <li>RESTful API</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="links-section">
          <h2>Quick Links</h2>
          <div className="links-grid">
            <a href="/api/health" className="link-card">
              <span className="link-icon">🏥</span>
              <span>Health Check</span>
            </a>
            <a href="/api/hello" className="link-card">
              <span className="link-icon">👋</span>
              <span>Hello API</span>
            </a>
            <Link to="/game" className="link-card">
              <span className="link-icon">🎮</span>
              <span>Game</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Ready to build something amazing! 🚀</p>
      </footer>
    </div>
  )
}

export default Home

