import { ApiService, ApiResponse } from './api';

export type ContactReason = 'sales' | 'support' | 'partnership' | 'press' | 'other';

export interface CreateContactTicketPayload {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  subject: string;
  reason: ContactReason;
  message: string;
  consent?: boolean;
}

export interface ContactTicketResponse {
  _id: string;
  ticketId: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
}

export async function createContactTicket(payload: CreateContactTicketPayload): Promise<ApiResponse<ContactTicketResponse>> {
  return ApiService.post('/contact-tickets', payload);
}


