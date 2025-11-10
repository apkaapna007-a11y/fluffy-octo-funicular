import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deep Research Agent — MCP Orchestrator",
  description: "Autonomous deep research and report generation powered by AI",
  keywords: ["research", "AI", "MCP", "autonomous agent", "deep learning"],
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
