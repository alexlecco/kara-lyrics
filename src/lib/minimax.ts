export interface VideoGenerationRequest {
  prompt: string;
  duration?: number;
  resolution?: '768P' | '1080P';
  aspectRatio?: '16:9' | '9:16';
}

export interface VideoGenerationResponse {
  taskId: string;
  status: string;
  videoUrl?: string;
}

const MINIMAX_API_HOST = process.env.MINIMAX_API_HOST || 'https://api.minimax.chat';
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;

export async function generateVideoBackground(
  prompt: string,
  duration: number = 6
): Promise<string> {
  if (!MINIMAX_API_KEY) {
    throw new Error('MINIMAX_API_KEY not configured');
  }

  const response = await fetch(`${MINIMAX_API_HOST}/v1/creative/video_generation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({
      prompt,
      model: 'video-01',
      duration,
      resolution: '1080P',
      aspect_ratio: '16:9',
    }),
  });

  if (!response.ok) {
    throw new Error(`Video generation failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.task_id;
}

export async function checkVideoStatus(taskId: string): Promise<VideoGenerationResponse> {
  if (!MINIMAX_API_KEY) {
    throw new Error('MINIMAX_API_KEY not configured');
  }

  const response = await fetch(`${MINIMAX_API_HOST}/v1/creative/video_generation/result`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({ task_id: taskId }),
  });

  if (!response.ok) {
    throw new Error(`Status check failed: ${response.statusText}`);
  }

  return response.json();
}

export async function createKaraokeVideo(
  videoUrl: string,
  lyrics: { text: string; startTime: number; endTime: number }[],
  audioUrl: string
): Promise<string> {
  const systemPrompt = `Create a karaoke video with beautiful drone footage of landscapes. The lyrics should appear as elegant text overlay synchronized with the music.`;

  const prompt = `Drone footage soaring over breathtaking landscapes - mountains, oceans, forests at golden hour. Elegant white text overlay for lyrics: ${lyrics.map(l => l.text).join(' | ')}`;

  return generateVideoBackground(prompt, 30);
}