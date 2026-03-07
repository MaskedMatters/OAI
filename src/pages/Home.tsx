import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getUser, triggerOrcidLogin } from '../lib/auth'

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    if (getUser()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  return (
    <div className="container">
      <Navbar activePath="/" />

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="hero-subtitle">Open Access Identifier</span>
            <h1>
              The <span className="sleek-underline">Free, Dynamic</span> Alternative to DOI.
            </h1>
            <p>
              Identifiers shouldn't be a luxury. OAI provides researchers, scholars, and institutions
              a completely free way to persist exactly where your links point. One fixed identifier, infinite possibilities.
            </p>
            <div className="hero-actions">
              <button
                className="btn btn-primary"
                onClick={() => triggerOrcidLogin()}
              >
                Sign in with ORCiD
              </button>
              <Link to="/about" className="btn btn-secondary">
                Read the Nomenclature
              </Link>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Why Choose OAI?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⛓️‍💥</div>
              <h3>Free Forever</h3>
              <p>We believe open access means accessible for everyone. Creating and managing your OAI costs absolutely nothing.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Dynamic Endpoints</h3>
              <p>Moved your paper? Changed your domain? With an OAI account, you can quickly edit where your identifier points without breaking links.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🪪</div>
              <h3>ORCiD Integrated</h3>
              <p>Seamless sign-up for academics. Link your ORCiD instantly to claim your first OAI mapping.</p>
            </div>
          </div>
        </section>
      </main>

      <footer style={{
        marginTop: 'var(--spacing-xl)',
        padding: 'var(--spacing-lg) 0',
        borderTop: '1px solid var(--color-border)',
        textAlign: 'center',
        color: '#666',
      }}>
        <p>&copy; 2026 OAI Registrar. All rights reserved.</p>
      </footer>
    </div>
  )
}
