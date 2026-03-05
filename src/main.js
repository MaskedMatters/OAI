import './style.css'
import { initAuth } from './auth.js'

// The HTML content to render in our app div.
// Normally you'd just write this in index.html, but to keep the Vite vanilla structure clean:
document.querySelector('#app').innerHTML = `
  <div class="container">
    <nav class="navbar">
      <div class="logo">
        <div class="logo-dot"></div>
        OAI
      </div>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/about.html">What is OAI?</a>
        <a href="#signin" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Sign In</a>
      </div>
    </nav>
    
    <main>
      <section class="hero">
        <div class="hero-content">
          <span class="hero-subtitle">Open Access Identifier</span>
          <h1>The <span class="sleek-underline">Free, Dynamic</span> Alternative to DOI.</h1>
          <p>
            Identifiers shouldn't be a luxury. OAI provides researchers, scholars, and institutions 
            a completely free way to persist exactly where your links point. One fixed identifier, infinite possibilities.
          </p>
          <div class="hero-actions">
            <a href="#orcid-login" class="btn btn-primary">Sign in with ORCiD</a>
            <a href="/about.html" class="btn btn-secondary">Read the Nomenclature</a>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Why Choose OAI?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">⛓️‍💥</div>
            <h3>Free Forever</h3>
            <p>We believe open access means accessible for everyone. Creating and managing your OAI costs absolutely nothing.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">✨</div>
            <h3>Dynamic Endpoints</h3>
            <p>Moved your paper? Changed your domain? With an OAI account, you can quickly edit where your identifier points without breaking links.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🪪</div>
            <h3>ORCiD Integrated</h3>
            <p>Seamless sign-up for academics. Link your ORCiD instantly to claim your first OAI mapping.</p>
          </div>
        </div>
      </section>
    </main>
    
    <footer style="margin-top: var(--spacing-xl); padding: var(--spacing-lg) 0; border-top: 1px solid var(--color-border); text-align: center; color: #666;">
      <p>&copy; 2026 OAI Registrar. All rights reserved.</p>
    </footer>
  </div>
`

// Simple logic can go here
console.log("OAI app loaded.")
initAuth()
