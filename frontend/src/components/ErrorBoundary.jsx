import React from 'react';

const APP_KEY_PREFIX = 'sr_';

const resetAppData = () => {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(APP_KEY_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(APP_KEY_PREFIX))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch (e) {
    // ignore
  }
  window.location.href = '/menu?table=1';
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#0c0d12', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fbbf24', marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20 }}>
            The app couldn&apos;t load, usually because of outdated data saved in this browser. Resetting fixes it.
          </p>
          <button
            type="button"
            onClick={resetAppData}
            style={{ padding: '10px 20px', borderRadius: 12, border: 'none', fontWeight: 700, color: '#fff', cursor: 'pointer', background: 'linear-gradient(90deg,#f59e0b,#ea580c)' }}
          >
            Reset &amp; Reload
          </button>
          <p style={{ fontSize: 11, color: '#475569', marginTop: 16, wordBreak: 'break-word' }}>
            {String(this.state.error?.message || this.state.error)}
          </p>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
