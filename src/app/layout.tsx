import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";

const font = localFont({ src: "./../assets/Daydream.woff2" });

export const metadata: Metadata = {
  title: "React Crossy Road",
  description: "A React implementation of the game Crossy Road",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
