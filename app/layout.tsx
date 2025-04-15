import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Modals from "@/components/Modals";
import { JotaiProvider } from "@/components/JotaiProvider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner"
import HeaderWrapper from "@/components/layout/HeaderWrapper";
import FooterWrapper from "@/components/layout/FooterWrapper";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Đặt tour du lịch",
  description: "Đặt tour du lịch online",
  icons: {
    icon: "/img/Travel.png",
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > <JotaiProvider>
          <SessionProvider>
            <Toaster />
            <Modals />
            <HeaderWrapper/>
            {children}
            <FooterWrapper/>
          </SessionProvider>
      </JotaiProvider>
      </body>
    </html>
  );
}
