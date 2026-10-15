import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Package, ShoppingCart, Sliders, QrCode, ArrowUpRight } from "lucide-react";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { isServerAdminAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/settings?tab=website", label: "Website Customization", icon: Sliders },
  { href: "/admin/settings?tab=payment", label: "Payment Settings", icon: QrCode },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await isServerAdminAuthenticated();

  // If not authenticated (or on login page), render children cleanly without dashboard sidebar
  if (!isAuth) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex">
      {/* ── Sidebar ── */}
      <aside className="w-60 bg-[#0B0B0E] flex flex-col fixed left-0 top-0 bottom-0 z-40 border-r border-[#1E1E26]">
        {/* Brand */}
        <div className="p-5 border-b border-[#1E1E26]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full ring-2 ring-[#F59E0B] overflow-hidden bg-[#F59E0B] shrink-0">
              <Image
                src="/images/anubhav.png"
                alt="Anubhav Bharti"
                width={32}
                height={32}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-tight">Anubhav Bharti</p>
              <p className="text-[#A2A2B0] text-[10px] font-mono">vedxlabs admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#A2A2B0] hover:text-white hover:bg-[#1E1E26] transition-colors text-xs font-semibold"
            >
              <Icon className="w-4 h-4 text-[#F59E0B]" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Switch to Storefront Link & Logout */}
        <div className="p-3 border-t border-[#1E1E26] space-y-1">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#A2A2B0] hover:text-[#F59E0B] hover:bg-[#1E1E26] transition-colors"
          >
            <span>Live Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* ── Main content shell ── */}
      <div className="flex-1 ml-60">
        <header className="bg-white border-b border-[#E5E5EB] h-14 flex items-center justify-between px-6 sm:px-8">
          <p className="text-xs text-[#707082]">
            <span className="text-[#0B0B0E] font-bold">vedxlabs</span> · Creator Platform
          </p>

          <Link
            href="/#products"
            target="_blank"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#F59E0B] hover:underline"
          >
            Preview Live Storefront <ArrowUpRight className="w-3 h-3" />
          </Link>
        </header>

        <main className="p-6 sm:p-8 max-w-6xl">{children}</main>
      </div>
    </div>
  );
}
