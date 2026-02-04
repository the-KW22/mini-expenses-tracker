import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/db/utilities';
import Sidebar from './sidebar';
import MobileHeader from './mobile-header';
import ThemeSynchronizer from '@/components/ThemeSynchronizer';
import { Toaster } from 'sonner';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  // Fetch fresh user data from database to ensure we have the latest name
  const dbUser = await getUserById(session.user.id);

  if (!dbUser) {
    redirect('/sign-in');
  }

  // Combine session data with fresh database data
  const user = {
    id: session.user.id,
    name: dbUser.name,
    email: dbUser.email,
    image: dbUser.image,
  };

  return (
    <div className="min-h-screen bg-surface">
      <Toaster position="top-center" richColors />
      {/* Synchronize user's saved theme from database */}
      <ThemeSynchronizer savedTheme={dbUser.theme} />
      {/* Sidebar - Left Navigation (includes user profile) */}
      <Sidebar user={user} />

      {/* Mobile Header - Only visible on mobile */}
      <MobileHeader user={user} />

      {/* Main Content Wrapper */}
      <div className="lg:pl-64">
        {/* Main Content Area */}
        <main className="pt-16 lg:pt-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
