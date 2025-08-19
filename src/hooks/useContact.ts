import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import { createContactTicket, CreateContactTicketPayload } from '@/services/contact';

export const useCreateContactTicket = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: CreateContactTicketPayload) => createContactTicket(payload),
    onSuccess: (res) => {
      toast.success('Thanks! Your message was sent. We’ll be in touch soon.');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error?.message || 'Failed to send message. Please try again.';
      toast.error(msg);
    },
  });
};


