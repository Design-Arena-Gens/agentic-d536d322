"use client";
import { useState } from 'react';

function Card({ title, children, footer }) {
  return (
    <div style={{ background: '#111827', border: '1px solid #22304a', borderRadius: 10, padding: 16 }}>
      <div style={{ fontWeight: 600, color: '#c9d1d9', marginBottom: 12 }}>{title}</div>
      <div>{children}</div>
      {footer ? <div style={{ marginTop: 12, color: '#9aa7b2', fontSize: 13 }}>{footer}</div> : null}
    </div>
  );
}

function IssueList({ issues }) {
  if (!issues?.length) return <div style={{ color: '#8b949e' }}>No issues found.</div>;
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
      {issues.map((iss, idx) => (
        <li key={idx} style={{ background: '#0b1220', border: '1px dashed #22304a', borderRadius: 8, padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ fontWeight: 600, color: '#e6edf3' }}>{iss.title}</div>
            <div style={{ color: '#9aa7b2', fontSize: 12 }}>{iss.severity?.toUpperCase?.() || 'INFO'}</div>
          </div>
          <div style={{ color: '#9aa7b2', marginTop: 4 }}>{iss.description}</div>
          <div style={{ color: '#9ecbff', marginTop: 6, fontSize: 12 }}>{iss.file}{typeof iss.line === 'number' ? `:${iss.line}` : ''}</div>
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  async function onAnalyze(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, branch })
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const counts = {
    reviewer: result?.reviewer?.issues?.length || 0,
    bugFinder: result?.bugFinder?.issues?.length || 0,
    refactor: result?.refactor?.suggestions?.length || 0,
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card title="Analyze a GitHub Repository" footer="Public repositories supported. Example: https://github.com/vercel/next.js">
        <form onSubmit={onAnalyze} style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ color: '#9aa7b2', fontSize: 13 }}>Repository URL</label>
            <input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #22304a', background: '#0b1220', color: '#e6edf3' }}
              required
            />
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ color: '#9aa7b2', fontSize: 13 }}>Branch</label>
            <input
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="main"
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #22304a', background: '#0b1220', color: '#e6edf3' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button disabled={loading} type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 8, cursor: 'pointer' }}>
              {loading ? 'Analyzing?' : 'Run Analysis'}
            </button>
            {error ? <span style={{ color: '#ff8a8a' }}>{error}</span> : null}
          </div>
        </form>
      </Card>

      {result && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <Card title={`Code Reviewer (${counts.reviewer})`}>
              <IssueList issues={result.reviewer.issues} />
            </Card>
            <Card title={`Bug Finder (${counts.bugFinder})`}>
              <IssueList issues={result.bugFinder.issues} />
            </Card>
            <Card title={`Refactor Suggestions (${counts.refactor})`}>
              <IssueList issues={result.refactor.suggestions} />
            </Card>
          </div>
          <Card title="Summary">
            <div style={{ color: '#9aa7b2' }}>
              Total files scanned: {result.summary.files}
              <br />
              Total findings: {result.summary.total}
              <br />
              Runtime: {Math.max(1, Math.round(result.summary.ms))} ms
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
