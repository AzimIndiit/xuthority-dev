import React, { useState } from 'react';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { Button } from '@/components/ui/button';
import { Mail, HelpCircle, MessageSquare, Newspaper } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { FormSelect } from '@/components/ui/FormSelect';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateContactTicket } from '@/hooks/useContact';
import type { CreateContactTicketPayload } from '@/services/contact';

// Zod validation schema
const contactFormSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .nonempty("First name is required"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .nonempty("Last name is required"),
  email: z.string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  company: z.string().max(100, "Company must be less than 100 characters").optional().or(z.literal('')),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(120, "Subject must be less than 120 characters"),
  reason: z.string().nonempty("Please select a reason"),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
    .nonempty("Message is required"),
  consent: z.boolean().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactUs: React.FC = () => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTicketMutation = useCreateContactTicket();

  const formMethods = useForm<ContactFormData>({
    mode: 'onChange',
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      subject: '',
      reason: '',
      message: '',
      consent: false,
    },
  });

  const handleSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      
      const payload: CreateContactTicketPayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        company: data.company || undefined,
        subject: data.subject,
        reason: data.reason as any,
        message: data.message,
        consent: data.consent,
      };

      await createTicketMutation.mutateAsync(payload);
      toast.success('Your message has been sent successfully! We\'ll get back to you soon.');
      formMethods.reset();
      
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left Section - Contact Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">We’re here to help</h1>
              <p className="text-lg text-gray-600 leading-relaxed">Tell us a bit about yourself and how we can help. Our team typically replies within 24 hours.</p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <a 
                href="mailto:info@xuthority.io" 
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-5 h-5 mr-3" />
                <span className="text-base">info@xuthority.io</span>
              </a>
              <p className="text-sm text-gray-500 pl-8">Mon–Fri, 9:00–18:00 (UTC) • Avg. response time: under 24h</p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 gap-6 mt-12">
              <div className="space-y-3 flex gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className='flex flex-col gap-2'>
                  <h3 className="font-semibold text-gray-900">Customer support</h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-sm">Get help with your account, billing, or product questions. We’ll guide you every step of the way.</p>
                </div>
              </div>

              <div className="space-y-3 flex gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <div className='flex flex-col gap-2'>
                  <h3 className="font-semibold text-gray-900">Feedback & suggestions</h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-sm">Your input helps us build a better Xuthority. Share what’s working and what we can improve.</p>
                </div>
              </div>

              <div className="space-y-3 flex gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Newspaper className="w-6 h-6 text-amber-600" />
                </div>
                <div className='flex flex-col gap-2'>
                  <h3 className="font-semibold text-gray-900">Press & media</h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-sm">For interviews, logos, and media assets, reach out and we’ll get back shortly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in touch</h2>
              <p className="text-gray-600">We’ll use your details only to respond to your inquiry.</p>
            </div>

            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    name="firstName"
                    label="First name"
                    placeholder="Enter your first name"
                    disabled={isSubmitting}
                  />
                  <FormInput
                    name="lastName"
                    label="Last name"
                    placeholder="Enter your last name"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email Field */}
                <FormInput
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="name@company.com"
                  disabled={isSubmitting}
                />

                {/* Company and Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    name="company"
                    label="Company (optional)"
                    placeholder="Your company name"
                    disabled={isSubmitting}
                  />
                  <FormInput
                    name="subject"
                    label="Subject"
                    placeholder="What’s this about?"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Reason */}
                <FormSelect
                  name="reason"
                  label="Reason"
                  placeholder="Select a reason"
                  options={[
                    { value: 'sales', label: 'Sales inquiry' },
                    { value: 'support', label: 'Product support' },
                    { value: 'partnership', label: 'Partnership opportunity' },
                    { value: 'press', label: 'Press / media' },
                    { value: 'other', label: 'Something else' },
                  ]}
                  searchable
                  disabled={isSubmitting}
                />

                {/* Message Field */}
                <FormTextarea
                  name="message"
                  label="Message"
                  placeholder="How can we help? Please include any relevant context."
                  rows={6}
                  disabled={isSubmitting}
                  className="resize-none"
                />

                {/* Character Counter */}
                <div className="text-right">
                  <span className="text-xs text-gray-500">
                    {formMethods.watch('message')?.length || 0}/1000
                  </span>
                </div>

              

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !formMethods.formState.isValid}
                  loading={isSubmitting}
                  leftIcon={Mail}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
                >
                  {isSubmitting ? 'Sending…' : 'Send message'}
                </Button>

                {/* Terms and Privacy */}
                <p className="text-xs text-center text-gray-500">
                  By contacting us, you agree to our{' '}
                  <a href="/terms" className="text-red-700 hover:text-blue-600 underline">
                    Terms of service
                  </a>{' '}
                  and{' '}
                  <a href="/policy" className="text-red-700 hover:text-blue-600 underline">
                    Privacy Policy
                  </a>
                </p>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;