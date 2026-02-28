import type { Metadata } from "next";
import { ConvexClientProvider } from "@/lib/convex";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mission Control",
  description: "Dashboard for managing projects, decisions, agents, and schedules",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground">
        <ConvexClientProvider>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 overflow-hidden">{children}</div>
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
