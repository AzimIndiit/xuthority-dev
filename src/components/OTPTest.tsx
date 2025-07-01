import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompanyEmailVerification } from '@/hooks/useOTP';

const OTPTest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');

  const {
    handleCompanyEmailSubmit,
    handleOTPVerification,
    handleResendOTP,
    isCreatingOTP,
    isVerifyingOTP,
    isResendingOTP,
  } = useCompanyEmailVerification();

  const handleEmailSubmit = async () => {
    try {
      await handleCompanyEmailSubmit(email, companyName, email, () => {
        setStep('otp');
      });
    } catch (error) {
      console.error('Email submission failed:', error);
    }
  };

  const handleOTPSubmit = async () => {
    try {
      await handleOTPVerification(email, otp, () => {
        alert('OTP verified successfully!');
        setStep('email');
        setOtp('');
      });
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  const handleResend = async () => {
    try {
      await handleResendOTP(email, () => {
        alert('OTP resent successfully!');
      });
    } catch (error) {
      console.error('OTP resend failed:', error);
    }
  };

  const handleLinkedInVerification = () => {
    // Redirect to LinkedIn OAuth verification endpoint
    const backendUrl = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1';
    window.location.href = `${backendUrl}/auth/linkedin/verify`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center">Verification Test Components</h2>
      
      {/* LinkedIn Verification Test */}
      <Card>
        <CardHeader>
          <CardTitle>LinkedIn Verification Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Test the LinkedIn verification flow for review verification.
            </p>
            <Button
              onClick={handleLinkedInVerification}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Test LinkedIn Verification
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* OTP Verification Test */}
      <Card>
        <CardHeader>
          <CardTitle>OTP Verification Test</CardTitle>
        </CardHeader>
        <CardContent>
      
      {step === 'email' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Company Name</label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <Button
            onClick={handleEmailSubmit}
            disabled={isCreatingOTP || !email || !companyName}
            className="w-full"
          >
            {isCreatingOTP ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">OTP Code</label>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
          </div>
          <Button
            onClick={handleOTPSubmit}
            disabled={isVerifyingOTP || otp.length !== 6}
            className="w-full"
          >
            {isVerifyingOTP ? 'Verifying...' : 'Verify OTP'}
          </Button>
          <Button
            onClick={handleResend}
            disabled={isResendingOTP}
            variant="outline"
            className="w-full"
          >
            {isResendingOTP ? 'Resending...' : 'Resend OTP'}
          </Button>
          <Button
            onClick={() => setStep('email')}
            variant="ghost"
            className="w-full"
          >
            Back to Email
          </Button>
        </div>
      )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPTest; 