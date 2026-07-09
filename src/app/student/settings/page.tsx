import { StudentSettingsForm } from '@/presentation/components/student/StudentSettingsForm';
import { auth } from '@/auth';

export default async function StudentSettingsPage() {
  const session = await auth();
  const initialName = session?.user?.name || '';
  const initialEmail = session?.user?.email || '';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-extrabold tracking-tight">Settings</h1>
        <p className="text-neutral-500 text-sm">Manage your student profile preferences.</p>
      </div>

      <StudentSettingsForm initialName={initialName} initialEmail={initialEmail} />
    </div>
  );
}
