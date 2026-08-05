import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { patientNav } from "@/components/portal/navs";

export const Route = createFileRoute("/patient")({
  component: () => (
    <PortalShell nav={patientNav} portalLabel="Patient portal">
      <Outlet />
    </PortalShell>
  ),
});
