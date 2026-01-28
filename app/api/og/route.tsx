/* eslint-disable */
import { ImageResponse } from 'next/og';

// export const runtime = 'edge'; // Incompatible with cacheComponents

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawTitle = searchParams.get('title') || 'NoStress AI';
  const title = rawTitle.length > 120 ? rawTitle.slice(0, 117) + '…' : rawTitle;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg,#0f172a,#1e293b,#111827)',
          color: 'white',
          fontSize: 64,
          fontWeight: 600,
          padding: '60px',
          fontFamily: 'system-ui, sans-serif'
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 400,
            opacity: 0.85,
            marginBottom: 24,
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
        >
          NoStress AI
        </div>
        <div
          style={{
            lineHeight: 1.05,
            background: 'linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4)',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 24,
            fontWeight: 400,
            opacity: 0.9
          }}
        >
          Courses • AI • Stress Management
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
