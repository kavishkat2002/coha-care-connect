import { Clock, MapPin, Star, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { patientService } from "@/services/patient.service";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Doctor } from "@/data/mock";

export function DoctorCard({ doctor, compact = false, onProfileClick }: { doctor: Doctor; compact?: boolean; onProfileClick?: (doctor: Doctor) => void }) {
  const [realNextSlot, setRealNextSlot] = useState<string | null>(null);
  const [realQueue, setRealQueue] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        const today = new Date().toISOString().split('T')[0]!;
        const slots = await patientService.getDoctorAvailability(doctor.id, today);
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        let next = slots.find((s: string) => {
          const parts = s.split(':').map(Number);
          const h = parts[0] ?? 0;
          const m = parts[1] ?? 0;
          return (h * 60 + m) > currentMinutes;
        });
        
        if (!next && slots.length > 0) next = slots[0];

        if (!isMounted) return;

        if (next) {
          setRealNextSlot(next);
          const qCount = await patientService.getSlotQueueCount(doctor.id, today, next);
          if (isMounted) setRealQueue(qCount);
        } else {
          setRealNextSlot("None");
          setRealQueue(0);
        }
      } catch (e) {
        // silently fallback
      }
    }
    fetchStats();
    return () => { isMounted = false; };
  }, [doctor.id]);

  return (
    <Card className="shadow-soft">
      <CardContent className="flex flex-col gap-4 p-4 sm:p-5 sm:flex-row sm:items-center">
        <Avatar 
          className={`size-11 sm:size-12 ${onProfileClick ? "cursor-pointer hover:opacity-80" : ""}`}
          onClick={(e) => {
            if (onProfileClick) {
              e.preventDefault();
              e.stopPropagation();
              onProfileClick(doctor);
            }
          }}
        >
          <AvatarFallback className="bg-accent text-sm font-semibold text-accent-foreground">
            {doctor.photoInitials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 
              className={`text-base font-semibold ${onProfileClick ? "cursor-pointer hover:underline" : ""}`}
              onClick={(e) => {
                if (onProfileClick) {
                  e.preventDefault();
                  e.stopPropagation();
                  onProfileClick(doctor);
                }
              }}
            >
              {doctor.name}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {doctor.specialty} · {doctor.experienceYears} yrs experience
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {doctor.hospital} · {doctor.branch}
          </p>
          {!compact ? (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span 
                  className={onProfileClick ? "cursor-pointer hover:underline" : ""} 
                  onClick={(e) => {
                    if (onProfileClick) {
                      e.preventDefault();
                      e.stopPropagation();
                      onProfileClick(doctor);
                    }
                  }}
                >
                  ({doctor.reviews} reviews)
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden="true" /> {doctor.distanceKm} km away
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5" aria-hidden="true" /> {realQueue !== null ? realQueue : doctor.queue} in queue
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden="true" /> 
                {realNextSlot !== null 
                  ? (realNextSlot === "None" ? "None" : `Today · ${realNextSlot}`) 
                  : doctor.nextSlot}
              </span>
              <span>{doctor.languages.join(", ")}</span>
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-2">
          <p className="text-sm font-semibold">LKR {doctor.fee.toLocaleString()}</p>
          <Button asChild size="sm" className="sm:w-auto">
            <Link to="/patient/book">Book</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
