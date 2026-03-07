import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getUser } from '../lib/auth'

const PARTS = [
  { id: '16',   label: '16',   desc: 'Namespace Prefix. Indicates that this string unambiguously belongs to the OAI namespace. It differentiates our links from DOIs (10).' },
  { id: 'xxxx', label: 'XXXX', desc: 'Registrar ID. An identifier starting at 1000 indicating which institution gave the OAI. Currently, there is only 1 (the OAI Registrar itself).' },
  { id: 'b',    label: 'B',    desc: 'Capacity Extension. If an institution exceeds 9,999 users, this digit increments (between 1 and 9). This allows institutions to register up to 89,991 users under a single XXXX ID.' },
  { id: 'yyyy', label: 'YYYY', desc: 'User ID String. A random string of numbers assigned upon ORCiD signup. These cannot repeat when B is identical.' },
  { id: 'zzzz', label: 'ZZZZ', desc: 'Creation Year. A four-digit representation of the year the specific OAI mapping was established (e.g., 2026).' },
  { id: 'aa',   label: 'AA',   desc: 'Mapping ID. The sequential number of the OAI for that specific user. Currently restricted to 01, as individual users are allowed 1 free OAI to start.' },
] as const

type PartId = typeof PARTS[number]['id']

import { useState } from 'react'

export default function About() {
  const navigate = useNavigate()
  const [highlighted, setHighlighted] = useState<PartId | null>(null)

  useEffect(() => {
    if (getUser()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  return (
    <div className="container">
      <Navbar activePath="/about" />

      <main>
        <section className="hero" style={{ minHeight: '40vh' }}>
          <div className="hero-content" style={{ maxWidth: '1000px', textAlign: 'center', margin: '0 auto' }}>
            <span className="hero-subtitle">Nomenclature &amp; Specifications</span>
            <h1>
              Decoding the <span className="sleek-underline">Open Access Identifier</span>.
            </h1>
            <p>
              An OAI isn't just a random string. It has a globally distinct registry structure designed
              to seamlessly handle billions of identifiers while remaining logically parsable.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="nomenclature-grid">

            <div className="nom-example">
              <div>
                {PARTS.map((part, i) => {
                  const sep = i === 0 ? '' : i === 1 ? '.' : i === 2 ? '.' : i === 3 ? '/' : i === 4 ? '.' : '.'
                  return (
                    <span key={part.id}>
                      {sep}
                      <span
                        onMouseEnter={() => setHighlighted(part.id)}
                        onMouseLeave={() => setHighlighted(null)}
                      >
                        {part.label}
                      </span>
                    </span>
                  )
                })}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#888', fontFamily: 'var(--font-family)', letterSpacing: 'normal' }}>
                EX: 16.1000.1/8432.2026.01
              </div>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '1rem', color: '#888' }}>
              Hover over the components above, or read the definitions below.
            </p>

            <div style={{ marginTop: 'var(--spacing-xl)' }}>
              {PARTS.map((part, i) => (
                <div
                  key={part.id}
                  className="nom-term"
                  style={{
                    ...(i === PARTS.length - 1 ? { borderBottom: 'none' } : {}),
                    ...(highlighted === part.id ? {
                      backgroundColor: 'var(--color-bg)',
                      transform: 'scale(1.02)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-sleek)',
                      borderLeft: '4px solid var(--color-secondary)',
                      borderBottom: i === PARTS.length - 1 ? 'none' : '1px solid var(--color-border)',
                    } : {
                      padding: '0 0 var(--spacing-md) 0',
                    }),
                  }}
                >
                  <span className="nom-part">{part.label}</span>
                  <span className="nom-desc">{part.desc}</span>
                </div>
              ))}
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
