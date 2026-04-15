'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function UploadPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('videoId');
  const [status, setStatus] = useState('initializing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!videoId) return;

    const processVideo = async () => {
      setStatus('downloading');
      setProgress(10);

      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus('processing');
      setProgress(30);

      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus('generating');
      setProgress(60);

      await new Promise(resolve => setTimeout(resolve, 3000));
      setStatus('finalizing');
      setProgress(90);

      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(100);
      setStatus('complete');
    };

    processVideo();
  }, [videoId]);

  if (!videoId) {
    return (
      <div style={styles.container}>
        <p>No video selected</p>
        <Link href="/" style={styles.link}>Go back</Link>
      </div>
    );
  }

  const statusMessages: Record<string, string> = {
    initializing: 'Initializing...',
    downloading: 'Downloading audio from YouTube...',
    processing: 'Separating stems with Moises AI...',
    generating: 'Generating video with MiniMax...',
    finalizing: 'Combining lyrics with video...',
    complete: 'Video ready!',
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Kara-lyrics</h1>
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt="Video thumbnail"
          style={styles.thumbnail}
        />
        
        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
          <p style={styles.status}>{statusMessages[status]}</p>
        </div>

        {status === 'complete' && (
          <Link href={`/result?videoId=${videoId}`} style={styles.button}>
            View Result
          </Link>
        )}
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
    fontSize: '32px',
    fontWeight: '300',
    margin: '0 0 24px',
    letterSpacing: '-1px',
  },
  thumbnail: {
    width: '100%',
    maxWidth: '320px',
    borderRadius: '8px',
    marginBottom: '32px',
  },
  progressContainer: {
    marginBottom: '24px',
  },
  progressBar: {
    height: '4px',
    background: '#333',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  progressFill: {
    height: '100%',
    background: '#fff',
    transition: 'width 0.3s ease',
  },
  status: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  button: {
    display: 'inline-block',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '500',
    textDecoration: 'none',
    border: 'none',
    borderRadius: '8px',
    background: '#fff',
    color: '#000',
  },
  link: {
    color: '#fff',
    fontSize: '14px',
  },
};