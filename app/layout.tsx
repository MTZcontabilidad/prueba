import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/providers/toast-provider";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "MTZ Consultores Tributarios - Expertos en Consultoría Fiscal",
  description: "Navega el complejo mundo tributario con profesionales expertos. Soluciones fiscales personalizadas, acceso seguro 24/7 a tu documentación y la tranquilidad que tu empresa necesita.",
  keywords: "consultores tributarios, asesoría fiscal, contabilidad, impuestos, SII, declaraciones, Chile",
  openGraph: {
    title: "MTZ Consultores Tributarios",
    description: "Expertos en consultoría fiscal y tributaria en Chile",
    url: "https://mtzconsultorestributarios.cl",
    siteName: "MTZ Consultores",
    locale: "es_CL",
    type: "website",
  },
};

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
