import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SalonDost | Daily Khata",
  description: "Modern Daily Khata for Indian Salons",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased selection:bg-orange-100 selection:text-orange-900`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
