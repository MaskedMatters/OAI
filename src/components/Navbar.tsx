import { Link } from 'react-router-dom'
import { triggerOrcidLogin } from '../lib/auth'

interface NavbarProps {
  activePath?: string
}

export default function Navbar({ activePath }: NavbarProps) {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <div className="logo-dot" />
        OAI
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link
          to="/about"
          style={activePath === '/about' ? { color: 'var(--color-primary)' } : undefined}
        >
          What is OAI?
        </Link>
        <button
          className="btn btn-primary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          onClick={(e) => {
            e.preventDefault()
            triggerOrcidLogin()
          }}
        >
          Sign In
        </button>
      </div>
    </nav>
  )
}
