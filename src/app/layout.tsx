import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kara-lyrics",
  description: "Create animated lyric videos from YouTube",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}