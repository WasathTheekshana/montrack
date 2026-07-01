import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Montrack — Track your money, own your future.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#F5F0EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Graph paper grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(10,10,10,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Accent blobs */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '320px',
            height: '320px',
            background: '#FFE135',
            border: '4px solid #0A0A0A',
            borderRadius: '48px',
            transform: 'rotate(12deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-40px',
            width: '220px',
            height: '220px',
            background: '#FF2D78',
            border: '4px solid #0A0A0A',
            borderRadius: '40px',
            transform: 'rotate(-8deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '80px',
            width: '100px',
            height: '100px',
            background: '#ADFF2F',
            border: '4px solid #0A0A0A',
            borderRadius: '20px',
            transform: 'rotate(6deg)',
          }}
        />

        {/* Main card */}
        <div
          style={{
            position: 'relative',
            background: '#FFFFFF',
            border: '4px solid #0A0A0A',
            borderRadius: '32px',
            padding: '56px 72px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: '8px 8px 0 #0A0A0A',
            maxWidth: '860px',
            width: '100%',
          }}
        >
          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                background: '#FFE135',
                border: '3px solid #0A0A0A',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '4px 4px 0 #0A0A0A',
                fontSize: '40px',
                fontWeight: 900,
                color: '#0A0A0A',
              }}
            >
              M
            </div>
            <span
              style={{
                fontSize: '42px',
                fontWeight: 900,
                color: '#0A0A0A',
                letterSpacing: '-1px',
              }}
            >
              Montrack
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#0A0A0A',
              lineHeight: 1.3,
            }}
          >
            Track your money,{' '}
            <span style={{ color: '#FF2D78' }}>own your future.</span>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: 'rgba(10,10,10,0.55)',
              lineHeight: 1.5,
            }}
          >
            Open-source personal finance PWA. Budget, track expenses across currencies, export backups. No account required.
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['Open Source', 'PWA', 'Multi-currency', 'Privacy-first'].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '6px 16px',
                  background: '#F5F0EB',
                  border: '2px solid #0A0A0A',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#0A0A0A',
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          {/* URL */}
          <div
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'rgba(10,10,10,0.35)',
              letterSpacing: '0.5px',
            }}
          >
            montrack.app
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
