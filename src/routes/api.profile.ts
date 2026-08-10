import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { type PatientProfile } from "@/services/patient.service";

let globalProfileStore: PatientProfile | null = null;

export const fetchProfileServer = createServerFn({ method: "GET" }).handler(async () => {
  return globalProfileStore;
});

export const updateProfileServer = createServerFn({ method: "POST" })
  .validator((data: PatientProfile) => data)
  .handler(async ({ data }: { data: PatientProfile }) => {
    globalProfileStore = data;
    return { success: true, profile: globalProfileStore };
  });

export const Route = createFileRoute("/api/profile")({
  component: () => null,
});
