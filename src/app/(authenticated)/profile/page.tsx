import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/profile-form';
import BookmarkList from '@/components/bookmark-list';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <ProfileForm profile={profile} />

      <div className="border-t border-border pt-6">
        <h2 className="text-lg font-bold mb-4">&#9733; 즐겨찾기</h2>
        <BookmarkList />
      </div>
    </div>
  );
}
