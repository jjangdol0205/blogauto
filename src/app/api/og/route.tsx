import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');

    const hasTitle = title && title.length > 0;
    const ogTitle = hasTitle ? title : '당신을 위한 프리미엄 정보';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a', // Deep navy/black
            backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(0, 229, 124, 0.15) 0%, #0f172a 80%)',
            borderTop: '16px solid #00e57c', // Top border for a balanced horizontal look
            fontFamily: 'sans-serif',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', // Center align for balance
              justifyContent: 'center',
              width: '100%',
              maxWidth: '1000px',
              textAlign: 'center', // Center text
              gap: '32px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 229, 124, 0.1)',
                padding: '12px 32px',
                borderRadius: '999px',
                fontSize: 26,
                color: '#00e57c', // Neon green
                fontWeight: 800,
                letterSpacing: '0.15em',
                border: '1px solid rgba(0, 229, 124, 0.3)',
                marginBottom: '10px',
              }}
            >
              PREMIUM REPORT
            </div>
            <div
              style={{
                fontSize: ogTitle.length > 25 ? 60 : 76,
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.35,
                wordBreak: 'keep-all',
                letterSpacing: '-0em',
                textShadow: '0 8px 16px rgba(0,0,0,0.6)',
                padding: '0 20px',
              }}
            >
              {ogTitle}
            </div>
          </div>
          
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              fontSize: 26,
              color: '#94a3b8',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ width: '48px', height: '4px', backgroundColor: '#00e57c', borderRadius: '2px' }} />
            DATA-DRIVEN SEO INSIGHTS
            <div style={{ width: '48px', height: '4px', backgroundColor: '#00e57c', borderRadius: '2px' }} />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.log(`${e instanceof Error ? e.message : 'Unknown Error'}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
