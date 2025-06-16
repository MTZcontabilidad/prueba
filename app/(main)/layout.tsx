import { MainNav } from "@/components/layout/main-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>
          © 2025 Sistema de Gestión de Clientes. Desarrollado con{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-foreground transition-colors"
          >
            Next.js
          </a>{" "}
          y{" "}
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-foreground transition-colors"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  );
}