import './style.css'
import { initAuth } from './auth.js'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <nav class="navbar">
      <div class="logo">
        <div class="logo-dot"></div>
        OAI
      </div>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/about.html" style="color: var(--color-primary)">What is OAI?</a>
        <a href="/#signin" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Sign In</a>
      </div>
    </nav>
    
    <main>
      <section class="hero" style="min-height: 40vh;">
        <div class="hero-content" style="max-width: 1000px; text-align: center; margin: 0 auto;">
          <span class="hero-subtitle">Nomenclature & Specifications</span>
          <h1>Decoding the <span class="sleek-underline">Open Access Identifier</span>.</h1>
          <p>
            An OAI isn't just a random string. It has a globally distinct registry structure designed 
            to seamlessly handle billions of identifiers while remaining logically parsable.
          </p>
        </div>
      </section>

      <section class="section" style="padding-top: 0;">
        <div class="nomenclature-grid" style="margin: 0 auto;">
          
          <div class="nom-example" style="display: flex; flex-direction: column; gap: 0.5rem; align-items: center;">
            <div><span id="n-16">16</span>.<span id="n-xxxx">XXXX</span>.<span id="n-b">B</span>/<span id="n-yyyy">YYYY</span>.<span id="n-zzzz">ZZZZ</span>.<span id="n-aa">AA</span></div>
            <div style="font-size: 0.9rem; color: #888; font-family: var(--font-family); letter-spacing: normal;">EX: 16.1000.1/8432.2026.01</div>
          </div>

          <p style="text-align: center; font-size: 0.9rem; margin-top: 1rem; color: #888;">Hover over the components above, or read the definitions below.</p>

          <div style="margin-top: var(--spacing-xl);">
            <div class="nom-term" id="desc-16">
              <span class="nom-part">16</span>
              <span class="nom-desc">Namespace Prefix. Indicates that this string unambiguously belongs to the OAI namespace. It differentiates our links from DOIs (10).</span>
            </div>
            <div class="nom-term" id="desc-xxxx">
              <span class="nom-part">XXXX</span>
              <span class="nom-desc">Registrar ID. An identifier starting at 1000 indicating which institution gave the OAI. Currently, there is only 1 (the OAI Registrar itself).</span>
            </div>
            <div class="nom-term" id="desc-b">
              <span class="nom-part">B</span>
              <span class="nom-desc">Capacity Extension. If an institution exceeds 9,999 users, this digit increments (between 1 and 9). This allows institutions to register up to 89,991 users under a single XXXX ID.</span>
            </div>
            <div class="nom-term" id="desc-yyyy">
              <span class="nom-part">YYYY</span>
              <span class="nom-desc">User ID String. A random string of numbers assigned upon ORCiD signup. These cannot repeat when B is identical.</span>
            </div>
            <div class="nom-term" id="desc-zzzz">
              <span class="nom-part">ZZZZ</span>
              <span class="nom-desc">Creation Year. A four-digit representation of the year the specific OAI mapping was established (e.g., 2026).</span>
            </div>
            <div class="nom-term" id="desc-aa" style="border-bottom: none;">
              <span class="nom-part">AA</span>
              <span class="nom-desc">Mapping ID. The sequential number of the OAI for that specific user. Currently restricted to 01, as individual users are allowed 1 free OAI to start.</span>
            </div>
          </div>
          
        </div>
      </section>
    </main>
    
    <footer style="margin-top: var(--spacing-xl); padding: var(--spacing-lg) 0; border-top: 1px solid var(--color-border); text-align: center; color: #666;">
      <p>&copy; 2026 OAI Registrar. All rights reserved.</p>
    </footer>
  </div>
`

// Simple highlight script
const highlights = ['16', 'xxxx', 'b', 'yyyy', 'zzzz', 'aa'];
highlights.forEach(id => {
  const el = document.getElementById('n-' + id);
  const desc = document.getElementById('desc-' + id);
  if (el && desc) {
    el.addEventListener('mouseenter', () => {
      desc.style.backgroundColor = 'var(--color-bg)';
      desc.style.transform = 'scale(1.02)';
      desc.style.transition = 'all var(--transition-fast)';
      desc.style.padding = '1rem';
      desc.style.borderRadius = 'var(--radius-sleek)';
      desc.style.borderLeft = '4px solid var(--color-secondary)';
    });
    el.addEventListener('mouseleave', () => {
      desc.style.backgroundColor = 'transparent';
      desc.style.transform = 'scale(1)';
      desc.style.padding = '0 0 var(--spacing-md) 0';
      desc.style.borderRadius = '0';
      desc.style.borderLeft = 'none';
      desc.style.borderBottom = '1px solid var(--color-border)';
    });
  }
});

initAuth();
