import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getUserById } from '@/lib/db/utilities';
import ProfileInfoCard from '@/components/profile/ProfileInfoCard';
import EditProfileForm from '@/components/profile/EditProfileForm';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import DeleteAccountSection from '@/components/profile/DeleteAccountSection';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <ProfileInfoCard
        name={user.name}
        email={user.email}
        image={user.image}
        createdAt={user.createdAt as Date}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <EditProfileForm currentName={user.name} />
        <ChangePasswordForm />
      </div>

      <DeleteAccountSection />
    </div>
  );
}
