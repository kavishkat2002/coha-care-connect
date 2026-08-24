import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

export function PageHeader({
  title,
  description,
  action,
  showBack,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  showBack?: boolean;
}) {
  const router = useRouter();
  
  // Default to showing back button if not on a root dashboard page
  const pathname = router.state.location.pathname;
  const isRoot = pathname === "/patient" || pathname === "/doctor" || pathname === "/hospital" || pathname === "/admin";
  
  const shouldShowBack = showBack !== undefined ? showBack : !isRoot;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-2">
      <div className="flex items-start gap-4">
        {shouldShowBack && (
          <button 
            onClick={() => router.history.back()}
            className="mt-1 p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title="Go back"
          >
            <ArrowLeft className="size-5" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}
