import { createServerFn } from "@tanstack/react-start";
import { type PatientProfile } from "@/services/patient.service";

let globalProfileStore: PatientProfile | null = null;

export const fetchServerProfile = createServerFn({ method: "GET" }).handler(async () => {
  return globalProfileStore;
});

export const updateServerProfile = createServerFn({ method: "POST" })
  .validator((data: PatientProfile) => data)
  .handler(async ({ data }) => {
    globalProfileStore = data;
    return { success: true, profile: globalProfileStore };
  });
