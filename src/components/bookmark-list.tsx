'use client';

import { useTranslations } from 'next-intl';
import { useBookmarks } from '@/hooks/use-bookmarks';

export default function BookmarkList() {
  const t = useTranslations('map');
  const { bookmarks, loading, removeBookmark } = useBookmarks();

  if (loading) {
    return <p className="text-sm text-muted">...</p>;
  }

  if (bookmarks.length === 0) {
    return <p className="text-sm text-muted">{t('noResults')}</p>;
  }

  return (
    <div className="space-y-2">
      {bookmarks.map((bm) => (
        <div key={bm.id} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card">
          <span className="text-yellow-500 text-lg flex-shrink-0">&#9733;</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{bm.name}</p>
            {bm.address && <p className="text-xs text-muted truncate">{bm.address}</p>}
          </div>
          <button
            onClick={() => removeBookmark(bm.id)}
            className="text-muted hover:text-red-500 transition-colors flex-shrink-0 p-1"
            title={t('removeBookmark')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
