import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import './index.css'

const BOOT_FALLBACK_ID = 'boot-fallback'

/**
 * Renders a last-resort message straight into #root when the app cannot even
 * boot (module evaluation failure, failed chunk load, etc.).
 * Without this, a runtime error leaves the user staring at a blank dark page.
 */
function renderFatal(message: string) {
  const root = document.getElementById('root')
  if (!root) return
  root.innerHTML = ''
  const wrap = document.createElement('div')
  wrap.className = 'min-h-screen flex items-center justify-center px-4'
  wrap.innerHTML = `
    <div role="alert" style="max-width:28rem;width:100%;background:#1a1410;border:1px solid #2a221b;border-radius:12px;padding:24px;text-align:center;font-family:system-ui,-apple-system,sans-serif">
      <h1 style="color:#f5f3f0;font-size:1.25rem;font-weight:700;margin:0 0 8px">Crispy Katta could not start</h1>
      <p style="color:#a89f91;font-size:0.875rem;margin:0 0 16px">${message}</p>
      <button type="button" onclick="window.location.reload()" style="background:#d97757;color:#fff;border:0;border-radius:8px;padding:12px 20px;font-size:0.875rem;min-height:44px;cursor:pointer">Reload app</button>
    </div>`
  root.appendChild(wrap)
}

function boot() {
  // Remove the static pre-JS placeholder now that React is about to take over.
  document.getElementById(BOOT_FALLBACK_ID)?.remove()

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  )
}

// Surface uncaught errors that happen outside React (e.g. failed dynamic
// imports) as a visible message rather than a blank screen.
window.addEventListener('error', (event) => {
  if (document.getElementById('root')?.children.length === 0) {
    renderFatal(event.message || 'An unexpected error occurred while loading the app.')
  }
})
window.addEventListener('unhandledrejection', (event) => {
  if (document.getElementById('root')?.children.length === 0) {
    const reason = event.reason instanceof Error ? event.reason.message : String(event.reason)
    renderFatal(reason || 'An unexpected error occurred while loading the app.')
  }
})

try {
  boot()
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown startup error'
  console.error('Crispy Katta failed to start:', error)
  renderFatal(message)
}
