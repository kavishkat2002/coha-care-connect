import { Clock, MapPin, Star, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Doctor } from "@/data/mock";

export function DoctorCard({ doctor, compact = false }: { doctor: Doctor; compact?: boolean }) {
  return (
    <Card className="shadow-soft">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <Avatar className="size-12">
          <AvatarFallback className="bg-accent text-sm font-semibold text-accent-foreground">
            {doctor.photoInitials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">{doctor.name}</h3>
            {doctor.online ? (
              <Badge variant="outline" className="border-success/20 bg-success/10 text-success">
                Online now
              </Badge>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">
            {doctor.specialty} · {doctor.experienceYears} yrs experience
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {doctor.hospital} · {doctor.branch}
          </p>
          {!compact ? (
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />
                {doctor.rating} ({doctor.reviews} reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden="true" /> {doctor.distanceKm} km away
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5" aria-hidden="true" /> {doctor.queue} in queue
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden="true" /> {doctor.nextSlot}
              </span>
              <span>{doctor.languages.join(", ")}</span>
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <p className="text-sm font-semibold">LKR {doctor.fee.toLocaleString()}</p>
          <Button asChild size="sm">
            <Link to="/patient/book">Book</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
