import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'NoStress AI';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

// Same as opengraph-image for Twitter
export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #faf9f7 0%, #f5f3f0 50%, #e8e4df 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'system-ui, sans-serif',
                    position: 'relative',
                }}
            >
                {/* Decorative shapes */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-100px',
                        right: '-100px',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'rgba(86, 130, 124, 0.15)',
                        filter: 'blur(60px)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-50px',
                        left: '-50px',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'rgba(198, 134, 80, 0.12)',
                        filter: 'blur(50px)',
                    }}
                />

                {/* Logo/Brand */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '32px',
                    }}
                >
                    <div
                        style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '18px',
                            background: 'linear-gradient(135deg, #56827c 0%, #427d76 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '36px',
                            fontWeight: 'bold',
                        }}
                    >
                        N
                    </div>
                </div>

                {/* Title */}
                <h1
                    style={{
                        fontSize: '72px',
                        fontWeight: '600',
                        color: '#1c1917',
                        margin: '0 0 16px 0',
                        textAlign: 'center',
                        lineHeight: 1.1,
                    }}
                >
                    NoStress AI
                </h1>

                {/* Tagline */}
                <p
                    style={{
                        fontSize: '28px',
                        color: '#5c554c',
                        margin: '0',
                        textAlign: 'center',
                        maxWidth: '800px',
                    }}
                >
                    Reduce mental load. Use AI intentionally.
                </p>

                {/* Bottom accent bar */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        height: '8px',
                        background: 'linear-gradient(90deg, #56827c 0%, #c68650 100%)',
                    }}
                />
            </div>
        ),
        {
            ...size,
        }
    );
}
