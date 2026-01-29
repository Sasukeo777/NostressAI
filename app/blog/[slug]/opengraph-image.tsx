import { ImageResponse } from 'next/og';
import { getPostMeta } from '@/lib/blog';

export const runtime = 'edge';

export const alt = 'NoStress AI Blog';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostMeta(slug);

    const title = post?.title || 'Blog Post';
    const category = post?.category || 'Article';

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #faf9f7 0%, #f5f3f0 50%, #e8e4df 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '60px',
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

                {/* Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        position: 'relative',
                    }}
                >
                    {/* Top: Category badge */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                    >
                        <div
                            style={{
                                padding: '8px 20px',
                                borderRadius: '24px',
                                background: 'rgba(86, 130, 124, 0.15)',
                                color: '#427d76',
                                fontSize: '18px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                            }}
                        >
                            {category}
                        </div>
                    </div>

                    {/* Middle: Title */}
                    <div
                        style={{
                            display: 'flex',
                            flex: 1,
                            alignItems: 'center',
                        }}
                    >
                        <h1
                            style={{
                                fontSize: title.length > 50 ? '48px' : '56px',
                                fontWeight: '600',
                                color: '#1c1917',
                                margin: '0',
                                lineHeight: 1.2,
                                maxWidth: '900px',
                            }}
                        >
                            {title}
                        </h1>
                    </div>

                    {/* Bottom: Logo and site name */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}
                    >
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #56827c 0%, #427d76 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '24px',
                                fontWeight: 'bold',
                            }}
                        >
                            N
                        </div>
                        <span
                            style={{
                                fontSize: '24px',
                                fontWeight: '500',
                                color: '#5c554c',
                            }}
                        >
                            NoStress AI
                        </span>
                    </div>
                </div>

                {/* Bottom accent bar */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        height: '6px',
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
