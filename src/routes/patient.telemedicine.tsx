import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Phone, Video } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";
import { AiDisclaimer } from "@/components/shared/AiDisclaimer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { doctors } from "@/data/mock";

export const Route = createFileRoute("/patient/telemedicine")({
  head: () => ({
    meta: [
      { title: "Telemedicine — COHA AI" },
      {
        name: "description",
        content: "Consult online doctors by video, voice or chat, with digital prescriptions and follow-ups.",
      },
      { property: "og:title", content: "Telemedicine — COHA AI" },
      { property: "og:description", content: "Video, voice and chat consultations with online doctors." },
    ],
  }),
  component: TelemedicinePage,
});

function TelemedicinePage() {
  const online = doctors.filter((d) => d.online);
  return (
    <div className="space-y-6">
      <PageHeader title="Telemedicine" description="Doctors available for an online consultation now." />
      <div className="grid gap-4 md:grid-cols-2">
        {online.map((d) => (
          <Card key={d.id} className="shadow-soft">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-4">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-accent text-sm font-semibold text-accent-foreground">
                    {d.photoInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {d.specialty} · {d.languages.join(", ")}
                  </p>
                </div>
                <Badge variant="outline" className="ml-auto border-success/20 bg-success/10 text-success">
                  Online
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Video", icon: Video },
                  { label: "Voice", icon: Phone },
                  { label: "Chat", icon: MessageSquare },
                ].map((mode) => (
                  <Button
                    key={mode.label}
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success(`${mode.label} consultation requested with ${d.name}`)}
                  >
                    <mode.icon className="mr-1.5 size-4" /> {mode.label}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                LKR {d.fee.toLocaleString()} · digital prescription included
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <AiDisclaimer className="max-w-2xl" />
    </div>
  );
}
