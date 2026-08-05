import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { doctorNav } from "@/components/portal/navs";

export const Route = createFileRoute("/doctor")({
  component: () => (
    <PortalShell nav={doctorNav} portalLabel="Doctor portal">
      <Outlet />
    </PortalShell>
  ),
});
