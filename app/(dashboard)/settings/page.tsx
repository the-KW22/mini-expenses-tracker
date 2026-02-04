import ThemeSelector from '@/components/settings/ThemeSelector';
import AboutSection from '@/components/settings/AboutSection';
import HelpSupportSection from '@/components/settings/HelpSupportSection';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences</p>
      </div>

      <div className="grid gap-6">
        <ThemeSelector />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AboutSection />
          <HelpSupportSection />
        </div>
      </div>
    </div>
  );
}
