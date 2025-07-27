// src/types/sponsor.ts
export interface Sponsor {
  id: number;
  name: string;
  name_en?: string;
  logoUrl?: string;
  description?: string;
}

export interface EventApplication {
  id: string;
  userId: string;
  eventId: string;
  sponsorId: string;
  userName: string;
  userEmail: string;
  eventTitle: string;
  sponsorName: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  processedAt?: string;
  token?: string;
}