import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import LoginLayout from '../../components/login/LoginLayout';
import ClinicLogo from '../../components/common/ClinicLogo';

export default function PatientLogin() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await sendOtp(email);
      setMessage(res.data.message || 'OTP sent to your email address.');
      setStep('otp');
    } catch (err) {
      const fieldErrors = err.response?.data?.errors;
      if (fieldErrors?.email) {
        setError(fieldErrors.email);
      } else {
        setError(err.response?.data?.message || 'Failed to send OTP. Check your email address.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await verifyOtp(email, otp);
      login(res.data);
      navigate('/patient');
    } catch (err) {
      const fieldErrors = err.response?.data?.errors;
      if (fieldErrors) {
        setError(Object.values(fieldErrors).join(' '));
      } else {
        setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout>
        <div className="mb-6 text-center">
          <ClinicLogo className="mx-auto mb-4 w-56 h-auto sm:w-64" />
          <h1 className="text-xl font-bold text-white">Patient Portal</h1>
          <p className="text-sm text-slate-400">Login with your registered email address</p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-slate-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                autoComplete="email"
                className="input-field"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending...' : 'Send OTP to Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {message && <p className="rounded-lg bg-accent/10 p-3 text-sm text-accent">{message}</p>}
            <div>
              <label className="mb-1.5 block text-sm text-slate-300">Enter 6-digit OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                className="input-field tracking-widest"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button type="button" onClick={() => setStep('email')} className="btn-secondary w-full">
              Change Email
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-xs text-slate-500">
          OTP is sent to the email stored in your patient record.
        </p>
    </LoginLayout>
  );
}
