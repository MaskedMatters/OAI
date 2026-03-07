import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setUser } from '../lib/auth'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Verifying ORCiD...')
  const [error, setError] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)

    const accessToken = params.get('access_token')
    const idToken = params.get('id_token')
    const err = params.get('error')

    if (err) {
      setStatus('Authentication failed: ' + err)
      setError(true)
      setTimeout(() => navigate('/', { replace: true }), 3000)
      return
    }

    if (accessToken && idToken) {
      try {
        const payloadBase64 = idToken.split('.')[1]
        const payloadDecoded = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')))

        const orcid: string = payloadDecoded.sub
        const name: string = payloadDecoded.given_name
          ? `${payloadDecoded.given_name} ${payloadDecoded.family_name ?? ''}`.trim()
          : payloadDecoded.name ?? 'Researcher'

        setUser({ name, orcid, token: accessToken })
        setStatus('Authentication successful. Redirecting...')
        setTimeout(() => navigate('/dashboard', { replace: true }), 800)
      } catch (e) {
        console.error('JWT Parse Error', e)
        setStatus('Error parsing authentication data.')
        setError(true)
        setTimeout(() => navigate('/', { replace: true }), 3000)
      }
    } else {
      console.error('Missing tokens', { accessToken: !!accessToken, idToken: !!idToken })
      setStatus('No credentials received from ORCiD.')
      setError(true)
      setTimeout(() => navigate('/', { replace: true }), 2000)
    }
  }, [navigate])

  return (
    <div style={{
      margin: 0,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg)',
      fontFamily: 'var(--font-family)',
      color: 'var(--color-text)',
    }}>
      {!error && (
        <div style={{
          border: '4px solid var(--color-border)',
          borderTop: '4px solid var(--color-primary)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem',
        }} />
      )}
      <h2 style={{ color: error ? 'red' : 'var(--color-text)' }}>{status}</h2>
    </div>
  )
}
