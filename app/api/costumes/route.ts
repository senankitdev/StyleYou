import { NextResponse } from 'next/server';
import { SAMPLE_COSTUMES } from '@/lib/constants';

export async function GET() {
  // For the MVP, we just return the hardcoded samples from constants.
  // In a full production app, these could be fetched from Cloudinary or a DB table.
  return NextResponse.json({
    data: { costumes: SAMPLE_COSTUMES },
    error: null
  });
}
