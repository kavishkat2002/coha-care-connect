import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { adminNav } from "@/components/portal/navs";

export const Route = createFileRoute("/admin")({
  component: () => (
    <PortalShell nav={adminNav} portalLabel="Admin portal">
      <Outlet />
    </PortalShell>
  ),
});
