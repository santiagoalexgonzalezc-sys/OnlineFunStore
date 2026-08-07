import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Store Management Simulator",
  description: "Build and manage your own retail empire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}