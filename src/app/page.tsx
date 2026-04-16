'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(url);
    
    if (!id) {
      setError('Invalid YouTube URL');
      return;
    }
    
    setError('');
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    window.location.href = `/upload?videoId=${id}`;
  };

  if (!mounted) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Kara-lyrics</h1>
        <p style={styles.subtitle}>Create animated lyric videos from YouTube</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL..."
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Processing...' : 'Create Video'}
          </button>
        </form>
        
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    padding: '48px 32px',
    textAlign: 'center',
  },
  title: {
    fontSize: '48px',
    fontWeight: '300',
    margin: '0 0 8px',
    letterSpacing: '-2px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 40px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  input: {
    padding: '16px 20px',
    fontSize: '16px',
    border: '1px solid #333',
    borderRadius: '8px',
    background: '#111',
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '8px',
    background: '#fff',
    color: '#000',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  error: {
    color: '#ff4444',
    fontSize: '14px',
    marginTop: '16px',
  },
  loading: {
    color: '#666',
    fontSize: '16px',
  },
};