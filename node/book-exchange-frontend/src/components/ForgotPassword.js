import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import api from './Api'; // Adjust the path as per your project structure

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Verify OTP & Reset password
  const [timer, setTimer] = useState(30); // 30 seconds countdown
  const [isResendVisible, setIsResendVisible] = useState(false); // Controls "Resend OTP" visibility
  const navigate = useNavigate(); // Initialize useNavigate

  // Countdown effect for OTP timer
  useEffect(() => {
    let countdown;
    if (step === 2 && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsResendVisible(true); // Show "Resend OTP" when timer reaches 0
    }
    return () => clearInterval(countdown);
  }, [step, timer]);

  // Resend OTP function
  const handleResendOtp = async () => {
    try {
      const response = await api.post('send-password-reset-code/', { email });
      if (response.status === 200) {
        setMessage('OTP has been resent. Check your email.');
        setTimer(30); // Reset the timer
        setIsResendVisible(false);
      } else {
        setMessage('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || 'An error occurred while resending OTP.');
    }
  };

  // Send OTP initially
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('send-password-reset-code/', { email });
      if (response.status === 200) {
        setMessage('Check your email for the OTP.');
        setStep(2);
        setTimer(30); // Start the 30-second countdown
        setIsResendVisible(false); // Hide "Resend OTP" initially
      } else {
        setMessage('An error occurred. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || 'An error occurred during password reset');
    }
  };

  const handleVerifyOtpAndResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await api.post('verify-reset-code/', {
        email,
        code: otp,
        new_password: newPassword,
      });

      if (response.status === 200) {
        setMessage('Password reset successful, try logging with new password');
        setStep(1);

        // Wait for 3 seconds, then navigate to login page
        setTimeout(() => {
        navigate('/login');
          }, 3000);
      } else {
        setMessage('Invalid OTP. Please try again.');
      }

      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || 'An error occurred during password reset');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7fc' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '40px', maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{step === 1 ? 'Forgot Password' : 'Verify OTP and Reset Password'}</h2>

        {message && <p style={{ color: message.includes('Check your email') ? 'green' : 'red', textAlign: 'center', marginBottom: '20px' }}>{message}</p>}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: '15px' }}>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px' }}>Send Reset Link</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtpAndResetPassword}>
            <div style={{ marginBottom: '15px' }}>
              <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }} />
            </div>
            <p style={{ textAlign: 'center', color: 'gray' }}>Resend otp in: {timer} seconds</p>
            {isResendVisible && (
              <p style={{ textAlign: 'center', color: 'blue', cursor: 'pointer' }} onClick={handleResendOtp}>
                Resend OTP
              </p>
            )}

            <div style={{ marginBottom: '15px' }}>
              <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px' }}>Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
