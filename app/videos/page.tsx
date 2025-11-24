import { SectionHeading } from '@/components/ui/SectionHeading';

const videos = [
  { id: 'dQw4w9WgXcQ', title: 'Introduction: AI & Calm' },
  { id: 'Zi_XLOBDo_Y', title: 'Anti-Overload Routine (demo)' },
  { id: 'kXYiU_JCYtU', title: 'Focus script & distraction reduction' }
];

export default function VideosPage() {
  return (
    <div className="site-container space-y-10">
      <SectionHeading title="Videos" eyebrow="Playlists & Demos" />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <div key={v.id} className="space-y-3">
            <div className="aspect-video overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${v.id}`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{v.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
