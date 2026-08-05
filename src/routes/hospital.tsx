import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { hospitalNav } from "@/components/portal/navs";

export const Route = createFileRoute("/hospital")({
  component: () => (
    <PortalShell nav={hospitalNav} portalLabel="Hospital portal">
      <Outlet />
    </PortalShell>
  ),
});
