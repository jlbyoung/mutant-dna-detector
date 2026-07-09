import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mutant DNA Detector",
  description: "Detect whether a DNA sequence belongs to a mutant.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
