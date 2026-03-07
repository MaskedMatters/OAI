import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, clearUser, OAIUser, API_BASE } from '../lib/auth'

interface OAI {
  full_id: string
  target_url: string
  createdAt: string
}

type Tab = 'overview' | 'my-oais' | 'metrics' | 'settings'

const OAI_LIMIT = 20

const OrcidIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#A6CE39" />
    <path d="M7.70275 8.73037H5.21332V17.9304H7.70275V8.73037Z" fill="white" />
    <path d="M10.8358 8.73037H14.1206C17.6151 8.73037 19.3496 10.7483 19.3496 13.3331C19.3496 15.9189 17.5759 17.9304 14.1206 17.9304H10.8358V8.73037ZM13.3103 16.0353C15.5458 16.0353 16.7196 14.8817 16.7196 13.3331C16.7196 11.7853 15.5458 10.6273 13.3103 10.6273H13.257V16.0353H13.3103Z" fill="white" />
    <path d="M6.45802 7.2185C7.29177 7.2185 7.96781 6.54228 7.96781 5.70881C7.96781 4.8753 7.29177 4.19904 6.45802 4.19904C5.62423 4.19904 4.94824 4.8753 4.94824 5.70881C4.94824 6.54228 5.62423 7.2185 6.45802 7.2185Z" fill="white" />
  </svg>
)

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<OAIUser | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [oais, setOais] = useState<OAI[]>([])
  const [loadingOais, setLoadingOais] = useState(true)

  // Mint form
  const [targetUrl, setTargetUrl] = useState('')
  const [mintStatus, setMintStatus] = useState('')
  const [mintStatusColor, setMintStatusColor] = useState('#333')

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [oaiToDelete, setOaiToDelete] = useState<string | null>(null)
  const [deleteInput, setDeleteInput] = useState('')
  const [deleteStatus, setDeleteStatus] = useState('')

  // Edit statuses per index
  const [editStatuses, setEditStatuses] = useState<Record<number, { msg: string; color: string }>>({})
  const [editInputs, setEditInputs] = useState<Record<number, string>>({})

  useEffect(() => {
    const u = getUser()
    if (!u) {
      navigate('/', { replace: true })
      return
    }
    setUser(u)
  }, [navigate])

  const fetchOAIs = useCallback(async (u: OAIUser) => {
    setLoadingOais(true)
    try {
      const res = await fetch(`${API_BASE}/user/oais`, {
        headers: { 'x-orcid': u.orcid, 'x-name': u.name },
      })
      if (res.ok) {
        const data: OAI[] = await res.json()
        setOais(data)
      } else {
        setOais([])
      }
    } catch {
      setOais([])
    } finally {
      setLoadingOais(false)
    }
  }, [])

  useEffect(() => {
    if (user) fetchOAIs(user)
  }, [user, fetchOAIs])

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
  }

  const handleLogout = () => {
    clearUser()
    navigate('/', { replace: true })
  }

  const handleMint = async () => {
    if (!user || !targetUrl) return
    setMintStatus('Minting...')
    setMintStatusColor('#333')
    try {
      const res = await fetch(`${API_BASE}/oai/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-orcid': user.orcid,
          'x-name': user.name,
        },
        body: JSON.stringify({ target_url: targetUrl }),
      })
      if (res.ok) {
        setMintStatus('✓ Successfully minted!')
        setMintStatusColor('green')
        setTargetUrl('')
        fetchOAIs(user)
      } else {
        const err = await res.json()
        setMintStatus('Error: ' + (err.error || 'Failed to mint'))
        setMintStatusColor('red')
      }
    } catch {
      setMintStatus('Network Error')
      setMintStatusColor('red')
    }
  }

  const handleEdit = async (fullId: string, idx: number) => {
    if (!user || !editInputs[idx]) return
    setEditStatuses(prev => ({ ...prev, [idx]: { msg: 'Saving...', color: '#333' } }))
    try {
      const res = await fetch(`${API_BASE}/oai/${encodeURIComponent(fullId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-orcid': user.orcid,
          'x-name': user.name,
        },
        body: JSON.stringify({ target_url: editInputs[idx] }),
      })
      if (res.ok) {
        setEditStatuses(prev => ({ ...prev, [idx]: { msg: '✓ Updated!', color: 'green' } }))
        setEditInputs(prev => ({ ...prev, [idx]: '' }))
        fetchOAIs(user)
      } else {
        const err = await res.json()
        setEditStatuses(prev => ({ ...prev, [idx]: { msg: 'Error: ' + (err.error || 'Update failed'), color: 'red' } }))
      }
    } catch {
      setEditStatuses(prev => ({ ...prev, [idx]: { msg: 'Network error.', color: 'red' } }))
    }
  }

  const openDeleteModal = (fullId: string) => {
    setOaiToDelete(fullId)
    setDeleteInput('')
    setDeleteStatus('')
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setOaiToDelete(null)
    setDeleteInput('')
    setDeleteStatus('')
  }

  const handleDelete = async () => {
    if (!user || !oaiToDelete) return
    setDeleteStatus('Deleting...')
    try {
      const res = await fetch(`${API_BASE}/oai/${encodeURIComponent(oaiToDelete)}`, {
        method: 'DELETE',
        headers: { 'x-orcid': user.orcid, 'x-name': user.name },
      })
      if (res.ok) {
        closeDeleteModal()
        fetchOAIs(user)
      } else {
        const err = await res.json()
        setDeleteStatus('Error: ' + (err.error || 'Delete failed'))
      }
    } catch {
      setDeleteStatus('Network error.')
    }
  }

  if (!user) return null

  const count = oais.length
  const quotaPct = Math.min((count / OAI_LIMIT) * 100, 100)
  const quotaColor = count >= OAI_LIMIT
    ? '#e74c3c'
    : count >= Math.floor(OAI_LIMIT * 0.75)
      ? 'var(--color-secondary)'
      : 'var(--color-primary)'
  const quotaLabelColor = count >= OAI_LIMIT ? '#e74c3c' : count >= Math.floor(OAI_LIMIT * 0.75) ? '#b8860b' : '#888'
  const quotaText = count >= OAI_LIMIT
    ? `${count} of ${OAI_LIMIT} slots used — limit reached`
    : `${count} of ${OAI_LIMIT} slots used`

  return (
    <>
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="logo">
            <div className="logo-dot" />
            OAI
          </div>
          <nav className="sidebar-nav">
            {(['overview', 'my-oais', 'metrics', 'settings'] as Tab[]).map(tab => (
              <button
                key={tab}
                className={`sidebar-link${activeTab === tab ? ' active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab === 'overview' ? 'Overview'
                  : tab === 'my-oais' ? 'My OAIs'
                    : tab === 'metrics' ? 'Metrics'
                      : 'Settings'}
              </button>
            ))}
          </nav>
          <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-lg)' }}>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem' }}
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1>Hello, {user.name}</h1>
            <div className="orcid-badge">
              <OrcidIcon />
              {user.orcid || '0000-0000-0000-0000'}
            </div>
          </header>

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <section style={{ paddingTop: 0 }}>
              <div className="features-grid" style={{ marginTop: 0 }}>
                {/* Quota card */}
                <div className="feature-card">
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--color-primary)', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>
                      {count}
                    </span>
                    <span style={{ color: '#bbb', fontSize: '1.1rem', fontWeight: 600 }}>/ {OAI_LIMIT}</span>
                  </div>
                  <p style={{ margin: 0, fontWeight: 600 }}>Active OAIs</p>
                  <div style={{ marginTop: '0.75rem', background: '#f0f0f0', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${quotaPct}%`, background: quotaColor, borderRadius: '4px', transition: 'width 0.6s ease, background 0.4s ease' }} />
                  </div>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.4rem', color: quotaLabelColor }}>{quotaText}</p>
                </div>

                {/* Mint card */}
                <div className="feature-card">
                  <h3 style={{ marginBottom: '0.5rem' }}>Mint New OAI</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', marginBottom: '1rem' }}>Enter the target URL you want your OAI to resolve to.</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="url"
                      placeholder="https://example.com/my-paper"
                      value={targetUrl}
                      onChange={e => setTargetUrl(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleMint()}
                      style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'var(--font-family)', fontSize: '0.9rem' }}
                    />
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={handleMint}>
                      Mint
                    </button>
                  </div>
                  {mintStatus && <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: mintStatusColor }}>{mintStatus}</div>}
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h2>Recent Identifiers</h2>
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {loadingOais ? (
                    <p>Loading OAIs...</p>
                  ) : oais.length === 0 ? (
                    <p style={{ color: '#888' }}>No OAIs yet. Mint your first one above!</p>
                  ) : oais.map(oai => (
                    <div key={oai.full_id} style={{
                      background: 'white', padding: '1rem 1.25rem', borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid var(--color-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                    }}>
                      <div>
                        <a
                          href={`/${oai.full_id}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none' }}
                          title={`Resolves to: ${oai.target_url}`}
                        >
                          OAI:{oai.full_id}
                        </a>
                        <div style={{ fontSize: '0.82rem', color: '#888', marginTop: '2px', wordBreak: 'break-all' }}>
                          → <a href={oai.target_url} target="_blank" rel="noreferrer" style={{ color: '#888' }}>{oai.target_url}</a>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#bbb', whiteSpace: 'nowrap' }}>
                        {new Date(oai.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* MY OAIs */}
          {activeTab === 'my-oais' && (
            <section style={{ paddingTop: 0 }}>
              <h2 style={{ marginBottom: '1.5rem' }}>My OAIs</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {loadingOais ? (
                  <p>Loading...</p>
                ) : oais.length === 0 ? (
                  <p style={{ color: '#888' }}>You have not minted any OAIs yet.</p>
                ) : oais.map((oai, idx) => (
                  <div key={oai.full_id} style={{
                    background: 'white', padding: '1.5rem', borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.07)', borderLeft: '4px solid var(--color-primary)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                          OAI:{oai.full_id}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#bbb', marginLeft: '0.75rem' }}>
                          {new Date(oai.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => openDeleteModal(oai.full_id)}
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.82rem', background: '#fff0f0', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--font-family)' }}
                      >
                        Delete
                      </button>
                    </div>
                    <div style={{ fontSize: '0.9rem', marginBottom: '1rem', wordBreak: 'break-all', color: '#555' }}>
                      <strong>Target:</strong>{' '}
                      <a href={oai.target_url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>{oai.target_url}</a>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="url"
                        placeholder="New target URL"
                        value={editInputs[idx] ?? ''}
                        onChange={e => setEditInputs(prev => ({ ...prev, [idx]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleEdit(oai.full_id, idx)}
                        style={{ flex: 1, padding: '0.45rem 0.6rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', fontFamily: 'var(--font-family)' }}
                      />
                      <button className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.9rem' }} onClick={() => handleEdit(oai.full_id, idx)}>
                        Update
                      </button>
                    </div>
                    {editStatuses[idx] && (
                      <div style={{ fontSize: '0.82rem', marginTop: '0.4rem', color: editStatuses[idx].color }}>
                        {editStatuses[idx].msg}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* METRICS */}
          {activeTab === 'metrics' && (
            <section style={{ paddingTop: 0 }}>
              <h2>Metrics</h2>
              <p style={{ marginTop: '1rem', color: '#888' }}>Traffic and click analytics coming soon.</p>
            </section>
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <section style={{ paddingTop: 0 }}>
              <h2>Settings</h2>
              <p style={{ marginTop: '1rem', color: '#888' }}>Account settings coming soon.</p>
            </section>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'white', borderRadius: '12px', padding: '2rem',
            maxWidth: '480px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ margin: '0 0 0.75rem', color: '#c0392b' }}>Delete OAI</h3>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}>
              This action is <strong>irreversible</strong>. The identifier will stop resolving immediately.
            </p>
            <p style={{ margin: '0 0 1rem', fontSize: '0.95rem' }}>
              Type <code style={{ background: '#f4f4f4', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>{oaiToDelete}</code> to confirm:
            </p>
            <input
              type="text"
              placeholder="Type the OAI identifier here"
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box', padding: '0.6rem', marginBottom: '1rem',
                border: '2px solid #e74c3c', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'var(--font-family)',
              }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem' }} onClick={closeDeleteModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{
                  padding: '0.5rem 1.25rem',
                  background: '#e74c3c', borderColor: '#e74c3c',
                  opacity: deleteInput === oaiToDelete ? 1 : 0.5,
                  cursor: deleteInput === oaiToDelete ? 'pointer' : 'not-allowed',
                }}
                disabled={deleteInput !== oaiToDelete}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
            {deleteStatus && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', textAlign: 'center', color: 'red' }}>
                {deleteStatus}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
