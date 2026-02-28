import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import type { AgentStatus as AgentStatusType } from "@/types";

interface AgentStatusProps {
  status: AgentStatusType;
}

export function AgentStatus({ status }: AgentStatusProps) {
  const config = {
    running: {
      variant: "info" as const,
      label: "Running",
      icon: Loader2,
      iconClass: "animate-spin",
    },
    done: {
      variant: "success" as const,
      label: "Done",
      icon: CheckCircle2,
      iconClass: "",
    },
    failed: {
      variant: "destructive" as const,
      label: "Failed",
      icon: XCircle,
      iconClass: "",
    },
  };

  const { variant, label, icon: Icon, iconClass } = config[status];

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${iconClass}`} />
      {label}
    </Badge>
  );
}
