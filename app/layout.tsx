import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "MoneyMate — Smart Expense Tracker & Split Bill",
  description:
    "AI-powered personal finance platform: expense tracking, receipt scanning, split bills, budgeting, and analytics — all in one beautiful app.",
  metadataBase: new URL("https://moneymate.app"),
  openGraph: {
    title: "MoneyMate — Smart Expense Tracker & Split Bill",
    description:
      "Track spending, scan receipts with AI, split bills with friends, and hit your budget goals.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffce1" },
    { media: "(prefers-color-scheme: dark)", color: "#131b28" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: "card-surface !rounded-2xl !text-sm",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
