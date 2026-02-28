import type { Metadata, Viewport } from "next";
import { ConvexClientProvider } from "@/lib/convex";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mission Control",
  description: "Dashboard for managing projects, decisions, agents, and schedules",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
          <SidebarProvider>
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-hidden">{children}</div>
            </div>
          </SidebarProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
