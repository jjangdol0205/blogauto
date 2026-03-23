import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const top = searchParams.get('top') || '블로그 왕초보 필수';
    const mid = searchParams.get('mid') || '썸네일';
    const bottom = searchParams.get('bottom') || '5분 완성';

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
            backgroundColor: '#00C73C', // Naver Green similar
            fontFamily: 'sans-serif',
            position: 'relative',
            padding: '80px',
          }}
        >
          {/* Top Left Quote */}
          <div style={{ position: 'absolute', top: '90px', left: '100px', display: 'flex' }}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="#111111" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 4v7h-4v-7h4zm2-2h-8v11h4c0 3.309-2.691 6-6 6v2c4.411 0 8-3.589 8-8v-9zm11 2v7h-4v-7h4zm2-2h-8v11h4c0 3.309-2.691 6-6 6v2c4.411 0 8-3.589 8-8v-9z"/>
            </svg>
          </div>

          {/* Bottom Right Quote */}
          <div style={{ position: 'absolute', bottom: '90px', right: '100px', display: 'flex', transform: 'rotate(180deg)' }}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="#111111" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 4v7h-4v-7h4zm2-2h-8v11h4c0 3.309-2.691 6-6 6v2c4.411 0 8-3.589 8-8v-9zm11 2v7h-4v-7h4zm2-2h-8v11h4c0 3.309-2.691 6-6 6v2c4.411 0 8-3.589 8-8v-9z"/>
            </svg>
          </div>

          {/* Top Line */}
          <div style={{ position: 'absolute', top: '150px', left: '260px', right: '100px', height: '8px', backgroundColor: '#111111' }} />
          
          {/* Bottom Line */}
          <div style={{ position: 'absolute', bottom: '150px', left: '100px', right: '260px', height: '8px', backgroundColor: '#111111' }} />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              textAlign: 'center',
              zIndex: 10,
              gap: '40px',
            }}
          >
            {/* Top Text */}
            <div
              style={{
                display: 'flex',
                fontSize: 60,
                fontWeight: 900,
                color: '#111111',
                marginBottom: '10px',
                letterSpacing: '-0.05em',
              }}
            >
              {top}
            </div>

            {/* Mid Text */}
            <div
              style={{
                display: 'flex',
                fontSize: 180,
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.1,
                letterSpacing: '-0.06em',
                textShadow: '3px 4px 0px rgba(0,0,0,0.15)',
              }}
            >
              {mid}
            </div>

            {/* Bottom Text */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                marginTop: '10px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 130,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.05em',
                  lineHeight: 1.1,
                  zIndex: 2,
                  textShadow: '3px 4px 0px rgba(0,0,0,0.15)',
                }}
              >
                {bottom}
              </div>
              
              {/* Underlines under the bottom text */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '5px',
                  width: '105%',
                  height: '24px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  zIndex: 1,
                  opacity: 0.9,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '10%',
                  width: '80%',
                  height: '10px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '5px',
                  zIndex: 1,
                  opacity: 0.9,
                }}
              />
            </div>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1080,
      }
    );
  } catch (e: unknown) {
    console.log(`${e instanceof Error ? e.message : 'Unknown Error'}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
