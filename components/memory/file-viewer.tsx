import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface FileViewerProps {
  filename: string;
  content: string;
}

export function FileViewer({ filename, content }: FileViewerProps) {
  // Basic markdown rendering - just handle headers, bold, lists
  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h3 key={i} className="text-base font-semibold mt-4 mb-2">
            {line.slice(4)}
          </h3>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="text-lg font-semibold mt-4 mb-2">
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h1 key={i} className="text-xl font-bold mt-4 mb-2">
            {line.slice(2)}
          </h1>
        );
      }
      // List items
      if (line.startsWith("- ")) {
        return (
          <li key={i} className="ml-4">
            {line.slice(2)}
          </li>
        );
      }
      // Empty lines
      if (line.trim() === "") {
        return <br key={i} />;
      }
      // Regular text
      return (
        <p key={i} className="mb-1">
          {line}
        </p>
      );
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" />
          {filename}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-invert prose-sm max-w-none text-foreground">
          {renderContent(content)}
        </div>
      </CardContent>
    </Card>
  );
}
