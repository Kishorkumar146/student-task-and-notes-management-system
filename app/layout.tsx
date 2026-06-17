  import type { Metadata } from "next";
  import "./globals.css";

  export const metadata: Metadata = {
    title: "StudySpace — Notes & Tasks",
    description: "Your all-in-one student workspace",
  };

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }