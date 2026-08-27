/**
 * Doctor Domain Types
 * Canonical doctor entity used across booking, telemedicine, AI care recommendations, and doctor portals.
 */

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  branch: string;
  city: string;
  distanceKm: number;
  experienceYears: number;
  rating: number;
  reviews: number;
  fee: number;
  languages: string[];
  online: boolean;
  queue: number;
  nextSlot: string;
  photoInitials: string;
  about: string;
  availability?: Record<string, boolean>;
};
