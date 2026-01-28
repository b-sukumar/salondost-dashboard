import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar, MobileNav } from "@/components/Sidebar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "SalonDost | Daily Khata",
  description: "Modern Daily Khata for Indian Salons",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SalonDost",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-orange-100 selection:text-orange-900 bg-gray-50`}>
        <div className="lg:pl-64 min-h-screen">
          <Sidebar />
          <div className="pb-20 lg:pb-0">
            {children}
          </div>
          <MobileNav />
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
