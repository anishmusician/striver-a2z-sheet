import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface VideoModalProps {
  url: string | null;
  title: string;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ url, title, onClose }) => {
  if (!url) return null;

  // Extract YouTube ID and timestamp
  let videoId = '';
  let startTime = 0;

  try {
    if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/')[1].split('?');
      videoId = parts[0];
      if (parts[1]) {
        const params = new URLSearchParams(parts[1]);
        const t = params.get('t');
        if (t) startTime = parseInt(t.replace('s', ''), 10) || 0;
      }
    } else if (url.includes('youtube.com/watch')) {
      const parsedUrl = new URL(url);
      videoId = parsedUrl.searchParams.get('v') || '';
      const t = parsedUrl.searchParams.get('t');
      if (t) startTime = parseInt(t.replace('s', ''), 10) || 0;
    }
  } catch (e) {
    console.error('Error parsing video URL', e);
  }

  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1${startTime ? `&start=${startTime}` : ''}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h3 className="font-semibold text-slate-900 text-sm md:text-base line-clamp-1">
              {title} - Video Walkthrough
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Open directly on YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="text-center p-8 bg-slate-950">
              <p className="text-slate-400 mb-4">Could not parse video directly for embedding.</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Watch on YouTube <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-slate-50 text-xs text-slate-500 flex items-center justify-between border-t border-slate-200">
          <span>Official TakeUforward Striver Tutorial</span>
          {startTime > 0 && <span>Starts at {Math.floor(startTime / 60)}m {startTime % 60}s</span>}
        </div>
      </div>
    </div>
  );
};
