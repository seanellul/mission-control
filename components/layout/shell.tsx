import { Header } from "./header";

interface ShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function Shell({ children, title, description }: ShellProps) {
  return (
    <div className="flex h-full flex-col">
      <Header title={title} description={description} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
