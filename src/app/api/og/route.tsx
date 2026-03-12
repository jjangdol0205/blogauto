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
            backgroundColor: '#000000',
            backgroundImage: 'linear-gradient(135deg, #1f1f1f 0%, #050505 100%)',
            border: '12px solid #262626', // Sleek inner border
            fontFamily: 'sans-serif',
            padding: '40px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '1000px',
              textAlign: 'center',
              gap: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 32px',
                borderRadius: '4px',
                fontSize: 22,
                color: '#a3a3a3', // Subtle gray
                fontWeight: 600,
                letterSpacing: '0.3em',
                borderTop: '1px solid #3f3f46',
                borderBottom: '1px solid #3f3f46',
                marginBottom: '10px',
              }}
            >
              EXPERT INSIGHT
            </div>
            <div
              style={{
                fontSize: ogTitle.length > 25 ? 56 : 72,
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.4,
                wordBreak: 'keep-all',
                letterSpacing: '-0.02em',
                padding: '0 40px',
              }}
            >
              {ogTitle}
            </div>
          </div>
          
          <div
            style={{
              position: 'absolute',
              bottom: '50px',
              fontSize: 22,
              color: '#737373',
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
              letterSpacing: '0.2em',
              gap: '24px',
            }}
          >
            <div style={{ width: '40px', height: '1px', backgroundColor: '#525252' }} />
            PREMIUM CURATION
            <div style={{ width: '40px', height: '1px', backgroundColor: '#525252' }} />
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
