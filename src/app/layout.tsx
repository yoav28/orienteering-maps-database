import {Geist, Geist_Mono} from "next/font/google";
import {ThemeProvider} from "./context/ThemeContext";
import type {Metadata} from "next";
import "./globals.scss";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orienteering Maps Database",
  description: "A database of orienteering maps",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} style={{isolation: "isolate"}}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
}
