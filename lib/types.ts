export interface Guest {
  id: string;
  email: string;
  name: string;
  phone?: string;
  invitationSentAt?: Date;
  rsvpStatus?: 'pending' | 'accepted' | 'declined' | 'no_response';
  partySize: number;
  dietaryRestrictions?: string;
  invitationToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EngagementEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: 'engagement_party' | 'mehendi' | 'baraat' | 'walima' | 'other';
  guestList: string[]; // guest IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface EngagementConfig {
  id: string;
  coupleNames: {
    groom: string;
    bride: string;
  };
  engagementDate: Date;
  story: string;
  photos: string[]; // URLs
  primaryColor: string;
  secondaryColor: string;
  websiteUrl: string;
  updatedAt: Date;
}

export interface RSVPResponse {
  id: string;
  guestId: string;
  eventId: string;
  status: 'accepted' | 'declined';
  partySize: number;
  dietaryRestrictions?: string;
  specialRequests?: string;
  respondedAt: Date;
}
