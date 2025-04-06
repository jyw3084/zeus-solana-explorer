import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClusterProvider } from "@/providers/cluster";
import { ThemeProvider } from "@/providers/themeProvider";
import HeaderLayout from "@/components/layout/HeaderLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zeus Solana Explorer",
  description: "Explore the Solana blockchain with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClusterProvider>
            <HeaderLayout>
              {children}
            </HeaderLayout>
          </ClusterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
