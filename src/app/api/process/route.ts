import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json({ error: 'No video URL provided' }, { status: 400 });
    }

    return NextResponse.json({
      jobId: 'mock-job-id',
      status: 'processing',
      message: 'Video processing started',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}