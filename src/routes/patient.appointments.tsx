import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { appointments } from "@/data/mock";

export const Route = createFileRoute("/patient/appointments")({
  head: () => ({
    meta: [
      { title: "My appointments — COHA AI" },
      { name: "description", content: "Upcoming and past appointments with status and QR tickets." },
      { property: "og:title", content: "My appointments — COHA AI" },
      { property: "og:description", content: "Track upcoming and past consultations." },
    ],
  }),
  component: AppointmentsPage,
});

const variant = (status: string) =>
  status === "Confirmed" ? "secondary" : status === "Completed" ? "outline" : "outline";

function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Your full appointment history across hospitals and telemedicine."
        action={
          <Button asChild>
            <Link to="/patient/book">Book appointment</Link>
          </Button>
        }
      />
      <Card className="shadow-soft">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead className="hidden sm:table-cell">Specialty</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden sm:table-cell">Mode</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.doctor}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {a.specialty}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {a.hospital}
                  </TableCell>
                  <TableCell>
                    {a.date}
                    <span className="block text-xs text-muted-foreground">{a.time}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{a.mode}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={variant(a.status)}>{a.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
