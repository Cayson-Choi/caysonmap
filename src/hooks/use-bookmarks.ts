'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Bookmark {
  id: string;
  name: string;
  address: string | null;
  lat: number;
  lng: number;
  created_at: string;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchBookmarks = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setBookmarks(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const addBookmark = useCallback(async (name: string, lat: number, lng: number, address?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('bookmarks')
      .insert({ user_id: user.id, name, lat, lng, address: address ?? null })
      .select()
      .single();

    if (!error && data) {
      setBookmarks((prev) => [data, ...prev]);
    }
    return data;
  }, [supabase]);

  const removeBookmark = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id);

    if (!error) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }
  }, [supabase]);

  return { bookmarks, loading, addBookmark, removeBookmark, refetch: fetchBookmarks };
}
