import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * App-level error boundary.
 *
 * Guarantees that a runtime failure renders an actionable message instead of
 * leaving the user with a blank screen.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log for the owner's console; never render raw internals to the UI.
    console.error('Crispy Katta crashed:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0b09]">
        <div
          role="alert"
          className="bg-[#1a1410] border border-[#2a221b] rounded-lg p-6 max-w-md w-full text-center"
        >
          <AlertTriangle size={44} className="text-[#d97757] mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-[#a89f91] text-sm mb-4">
            The app hit an unexpected error. Your cart is still saved on this device.
          </p>
          <pre className="text-left text-xs text-[#a89f91] bg-[#0f0b09] border border-[#2a221b] rounded p-3 mb-5 overflow-x-auto whitespace-pre-wrap break-words">
            {error.message || 'Unknown error'}
          </pre>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#2a221b] text-white px-4 py-3 rounded-lg hover:bg-[#3a322b] min-h-[44px]"
            >
              <RefreshCw size={16} aria-hidden="true" />
              Try again
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#d97757] text-white px-4 py-3 rounded-lg hover:bg-[#c96649] min-h-[44px]"
            >
              Reload app
            </button>
          </div>
        </div>
      </div>
    )
  }
}
