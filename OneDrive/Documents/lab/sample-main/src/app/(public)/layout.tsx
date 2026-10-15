import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { getPlatformSettings } from "@/lib/settings";

/** Layout for all public-facing pages */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPlatformSettings();

  return (
    <>
      <PublicNav brand={settings.brand} />
      <main className="flex-1">{children}</main>
      <Footer brand={settings.brand} />
    </>
  );
}
