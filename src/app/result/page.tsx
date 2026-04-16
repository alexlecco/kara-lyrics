'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('videoId');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Kara-lyrics</h1>
          <div style={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div style={styles.container}>
        <p>No video found</p>
        <Link href="/" style={styles.link}>Go back</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Kara-lyrics</h1>
        
        <div style={styles.videoContainer}>
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="Video thumbnail"
            style={styles.thumbnail}
          />
          <div style={styles.overlay}>
            <span style={styles.badge}>Generated</span>
          </div>
        </div>

        <p style={styles.success}>Your karaoke video is ready!</p>
        
        <div style={styles.actions}>
          <button style={styles.buttonPrimary}>Download Video</button>
          <Link href="/" style={styles.buttonSecondary}>Create Another</Link>
        </div>
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
    maxWidth: '520px',
    padding: '48px 32px',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: '300',
    margin: '0 0 32px',
    letterSpacing: '-1px',
  },
  videoContainer: {
    position: 'relative',
    marginBottom: '24px',
  },
  thumbnail: {
    width: '100%',
    borderRadius: '12px',
  },
  overlay: {
    position: 'absolute',
    top: '12px',
    right: '12px',
  },
  badge: {
    background: '#00cc66',
    color: '#000',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  success: {
    fontSize: '18px',
    color: '#fff',
    margin: '0 0 32px',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  buttonPrimary: {
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '8px',
    background: '#fff',
    color: '#000',
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '500',
    textDecoration: 'none',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff',
  },
  link: {
    color: '#fff',
    fontSize: '14px',
  },
  loading: {
    color: '#666',
    fontSize: '16px',
  },
};