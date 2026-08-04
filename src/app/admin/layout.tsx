import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { LogoutButton } from "@/components/admin/LogoutButton";

const NAV = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/inscripciones", label: "Inscripciones" },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-ivory md:flex-row">
      {/* Sidebar (§21). En móvil se convierte en barra superior. */}
      <aside className="flex shrink-0 flex-col gap-6 bg-brand-forest px-5 py-6 md:w-60">
        <div className="flex items-center gap-2">
          <Logo size={40} />
          <span className="text-sm font-semibold text-brand-ivory">Caminata HEIM</span>
        </div>
        <nav className="flex gap-1 md:flex-col">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-brand-ivory/80 hover:bg-brand-ivory/10 hover:text-brand-ivory"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden md:block">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 px-5 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
