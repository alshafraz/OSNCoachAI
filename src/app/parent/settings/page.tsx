import { SettingsForm } from '@/presentation/components/shared/SettingsForm';
import { auth } from '@/auth';

export default async function ParentSettingsPage() {
  const session = await auth();
  const initialName = session?.user?.name || '';
  const initialEmail = session?.user?.email || '';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-extrabold tracking-tight">Settings</h1>
        <p className="text-neutral-500 text-sm">Manage your parent administrator settings.</p>
      </div>

      <SettingsForm initialName={initialName} initialEmail={initialEmail} />
    </div>
  );
}
