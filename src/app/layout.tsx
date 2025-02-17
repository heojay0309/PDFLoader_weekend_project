import "@/styles/globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";

import SideBar from "@/components/sidebar/SideBar";

import { UploadedFilesProvider } from "@/lib/context/UploadedFilesContext";
import { QueryProvider } from "@/lib/context/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlayAI Product Engineering Test Project",
  description: "Application for file uploads and text-to-speech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex antialiased`}
      >
        <QueryProvider>
          <UploadedFilesProvider>
            <SideBar />
            <div className="min-h-screen w-full flex-1">{children}</div>
          </UploadedFilesProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
