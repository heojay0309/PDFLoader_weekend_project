import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { UploadedFilesProvider } from '@/context/UploadedFilesContext';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PlayAI Product Engineering Test Project',
  description: 'Application for file uploads and text-to-speech',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-screen`}
      >
        <UploadedFilesProvider>{children}</UploadedFilesProvider>
      </body>
    </html>
  );
}
