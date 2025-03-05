import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tierhelden",
  description: "Videoschulungsplattform für Tierliebhaber",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Head>
        <script
          src="https://cloud.ccm19.de/app.js?apiKey=5aafada9ca3be898712d75b70c286efa217c18a8cdec6102&amp;domain=67c8705f5c350797fb07dc02"
          referrerPolicy="origin"
        ></script>
      </Head>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider>
            <ConfettiProvider />
            <ToastProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
