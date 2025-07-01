import api from './api';

export interface CreateOTPRequest {
  email: string;
  type: 'review_verification' | 'password_reset' | 'email_verification';
}

export interface CreateOTPResponse {
  email: string;
  expiresAt: string;
  message: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
  type: 'review_verification' | 'password_reset' | 'email_verification';
}

export interface VerifyOTPResponse {
  email: string;
  companyName?: string;
  companyEmail?: string;
  verifiedAt: string;
  message: string;
}

export interface ResendOTPRequest {
  email: string;
  type: 'review_verification' | 'password_reset' | 'email_verification';
}

export interface ResendOTPResponse {
  email: string;
  expiresAt: string;
  message: string;
}

const otpService = {
  /**
   * Create OTP for review verification
   */
  createOTP: async (data: CreateOTPRequest): Promise<CreateOTPResponse> => {
    const response = await api.post('/otp/create', data);
    return response.data.data;
  },

  /**
   * Verify OTP for review verification
   */
  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    const response = await api.post('/otp/verify', data);
    return response.data.data;
  },

  /**
   * Resend OTP for review verification
   */
  resendOTP: async (data: ResendOTPRequest): Promise<ResendOTPResponse> => {
    const response = await api.post('/otp/resend', data);
    return response.data.data;
  },
};

export default otpService; 