const MOISES_API_BASE = 'https://developer-api.moises.ai/api/v2';

const USER_ID = 'mAMpo2f50Mb7OxxQsqEvrWzB9D23';

export interface StemResult {
  url: string;
  instrument: string;
}

export interface LyricsLine {
  text: string;
  startTime: number;
  endTime: number;
}

export interface JobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  stems?: StemResult[];
  lyrics?: LyricsLine[];
}

export async function uploadAudio(audioUrl: string): Promise<string> {
  const response = await fetch(`${MOISES_API_BASE}/jobs/upload/url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': USER_ID,
    },
    body: JSON.stringify({ url: audioUrl }),
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.id;
}

export async function processStems(audioUrl: string): Promise<string> {
  const jobId = await uploadAudio(audioUrl);

  const response = await fetch(`${MOISES_API_BASE}/stems`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': USER_ID,
    },
    body: JSON.stringify({
      audioId: jobId,
      stems: ['vocals', 'instrumental'],
    }),
  });

  if (!response.ok) {
    throw new Error(`Stem processing failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.id;
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await fetch(`${MOISES_API_BASE}/jobs/${jobId}`, {
    headers: {
      'x-user-id': USER_ID,
    },
  });

  if (!response.ok) {
    throw new Error(`Job status failed: ${response.statusText}`);
  }

  return response.json();
}

export async function transcribeLyrics(audioUrl: string): Promise<string> {
  const jobId = await uploadAudio(audioUrl);

  const response = await fetch(`${MOISES_API_BASE}/lyrics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': USER_ID,
    },
    body: JSON.stringify({ audioId: jobId }),
  });

  if (!response.ok) {
    throw new Error(`Lyrics transcription failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.id;
}

export async function downloadAudioFromYouTube(videoUrl: string): Promise<string> {
  const ytdl = await import('ytdl-core');
  const info = await ytdl.getInfo(videoUrl);
  const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
  
  if (audioFormats.length === 0) {
    throw new Error('No audio format available');
  }

  return audioFormats[0].url;
}