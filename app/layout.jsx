export const metadata = {
  title: 'Multi-Agent Code Review & Debugging Network',
  description: 'Automated QA: reviewer, bug finder, refactorer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', background: '#0b1220', color: '#e6edf3', margin: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px 64px 16px' }}>
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1 style={{ margin: 0, fontSize: 22 }}>Multi-Agent Code Review & Debugging Network</h1>
            </a>
            <nav style={{ display: 'flex', gap: 16 }}>
              <a href="/" style={{ color: '#9ecbff', textDecoration: 'none' }}>Analyze</a>
              <a href="/paper" style={{ color: '#9ecbff', textDecoration: 'none' }}>Paper</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: '#9ecbff', textDecoration: 'none' }}>GitHub</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
