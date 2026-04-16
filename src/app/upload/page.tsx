'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { useVideoGenerator } from '@/hooks/useVideoGenerator';

export default function UploadPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('videoId');
  const { job, isProcessing, processVideo, reset } = useVideoGenerator();

  useEffect(() => {
    if (videoId && !job) {
      processVideo(`https://youtube.com/watch?v=${videoId}`);
    }
  }, [videoId, job, processVideo]);

  if (!videoId) {
    return (
      <div style={styles.container}>
        <p>No video selected</p>
        <Link href="/" style={styles.link}>Go back</Link>
      </div>
    );
  }

  const statusMessages: Record<string, string> = {
    idle: 'Initializing...',
    downloading: 'Downloading audio from YouTube...',
    processing_stems: 'Separating stems with Moises AI...',
    transcribing_lyrics: 'Transcribing lyrics...',
    generating_video: 'Generating video with MiniMax...',
    combining: 'Combining lyrics with video...',
    complete: 'Video ready!',
    error: 'An error occurred',
  };

  const currentStatus = job?.status || 'idle';
  const currentProgress = job?.progress || 0;

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
            <div style={{ ...styles.progressFill, width: `${currentProgress}%` }} />
          </div>
          <p style={styles.status}>{statusMessages[currentStatus]}</p>
          
          {job?.error && (
            <p style={styles.error}>{job.error}</p>
          )}
        </div>

        {currentStatus === 'complete' && (
          <Link 
            href={`/result?videoId=${videoId}&videoUrl=${encodeURIComponent(job?.videoUrl || '')}`} 
            style={styles.button}
          >
            View Result
          </Link>
        )}

        {currentStatus === 'error' && (
          <div style={styles.actions}>
            <button onClick={() => processVideo(`https://youtube.com/watch?v=${videoId}`)} style={styles.button}>
              Try Again
            </button>
            <Link href="/" style={styles.buttonSecondary}>Start Over</Link>
          </div>
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
  error: {
    color: '#ff4444',
    fontSize: '14px',
    marginTop: '12px',
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
    cursor: 'pointer',
  },
  buttonSecondary: {
    display: 'inline-block',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '500',
    textDecoration: 'none',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff',
    marginLeft: '12px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
  },
  link: {
    color: '#fff',
    fontSize: '14px',
  },
};