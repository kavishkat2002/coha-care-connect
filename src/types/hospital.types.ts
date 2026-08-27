/**
 * Hospital Domain Types
 * Canonical hospital entity used across hospital portal, booking, and branch management.
 */

export type Hospital = {
  id: string;
  name: string;
  city: string;
  rating: number;
  reviews: number;
  branches: string[];
  departments: string[];
  emergency: boolean;
  facilities: string[];
  phone: string;
};
