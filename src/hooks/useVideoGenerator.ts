import { useState, useCallback } from 'react';
import { processStems, transcribeLyrics, getJobStatus, downloadAudioFromYouTube } from '@/lib/moises';
import { generateVideoBackground, checkVideoStatus } from '@/lib/minimax';

export type ProcessingStatus = 
  | 'idle'
  | 'downloading'
  | 'processing_stems'
  | 'transcribing_lyrics'
  | 'generating_video'
  | 'combining'
  | 'complete'
  | 'error';

export interface VideoJob {
  id: string;
  videoId: string;
  status: ProcessingStatus;
  progress: number;
  stemUrl?: string;
  instrumentalUrl?: string;
  lyrics: { text: string; startTime: number; endTime: number }[];
  videoUrl?: string;
  error?: string;
}

export function useVideoGenerator() {
  const [job, setJob] = useState<VideoJob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateProgress = useCallback((status: ProcessingStatus, progress: number) => {
    setJob(prev => prev ? { ...prev, status, progress } : null);
  }, []);

  const processVideo = useCallback(async (youtubeUrl: string) => {
    setIsProcessing(true);
    
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      setJob({ id: '', videoId: '', status: 'error', progress: 0, lyrics: [], error: 'Invalid YouTube URL' });
      setIsProcessing(false);
      return;
    }

    setJob({
      id: '',
      videoId,
      status: 'downloading',
      progress: 10,
      lyrics: [],
    });

    try {
      // Step 1: Download audio from YouTube
      updateProgress('downloading', 20);
      const audioUrl = await downloadAudioFromYouTube(youtubeUrl);

      // Step 2: Process stems (separate vocals from instrumental)
      updateProgress('processing_stems', 40);
      const stemsJobId = await processStems(audioUrl);
      
      // Poll for stems completion
      let stemsJob = await getJobStatus(stemsJobId);
      while (stemsJob.status === 'processing' || stemsJob.status === 'pending') {
        await new Promise(resolve => setTimeout(resolve, 3000));
        stemsJob = await getJobStatus(stemsJobId);
      }

      if (stemsJob.status === 'failed') {
        throw new Error('Stem processing failed');
      }

      const instrumentalUrl = stemsJob.stems?.find(s => s.instrument === 'instrumental')?.url;

      // Step 3: Transcribe lyrics
      updateProgress('transcribing_lyrics', 60);
      const lyricsJobId = await transcribeLyrics(audioUrl);
      
      // Poll for lyrics completion
      let lyricsJob = await getJobStatus(lyricsJobId);
      while (lyricsJob.status === 'processing' || lyricsJob.status === 'pending') {
        await new Promise(resolve => setTimeout(resolve, 3000));
        lyricsJob = await getJobStatus(lyricsJobId);
      }

      if (lyricsJob.status === 'failed') {
        throw new Error('Lyrics transcription failed');
      }

      const lyrics = lyricsJob.lyrics || [];

      // Step 4: Generate video background with MiniMax
      updateProgress('generating_video', 80);
      const dronePrompt = `Cinematic drone footage soaring over breathtaking landscapes - majestic mountains, crystal blue oceans, lush green forests at golden hour, serene nature scenes, hyper-realistic 4K quality`;
      
      const taskId = await generateVideoBackground(dronePrompt, 30);

      // Poll for video generation
      let videoResult = await checkVideoStatus(taskId);
      while (videoResult.status === 'processing' || videoResult.status === 'pending') {
        await new Promise(resolve => setTimeout(resolve, 5000));
        videoResult = await checkVideoStatus(taskId);
      }

      updateProgress('complete', 100);
      
      setJob(prev => prev ? {
        ...prev,
        status: 'complete',
        progress: 100,
        instrumentalUrl,
        lyrics,
        videoUrl: videoResult.videoUrl,
      } : null);

    } catch (error) {
      setJob(prev => prev ? {
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      } : null);
    }

    setIsProcessing(false);
  }, [updateProgress]);

  const reset = useCallback(() => {
    setJob(null);
    setIsProcessing(false);
  }, []);

  return { job, isProcessing, processVideo, reset };
}

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}