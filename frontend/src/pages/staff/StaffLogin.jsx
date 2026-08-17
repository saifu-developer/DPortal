import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { staffLogin } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import LoginLayout from '../../components/login/LoginLayout';
import ClinicLogo from '../../components/common/ClinicLogo';

export default function StaffLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await staffLogin(username, password);
      login(res.data);
      navigate('/staff');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout>
        <div className="mb-6 text-center">
          <ClinicLogo className="mx-auto mb-4 w-56 h-auto sm:w-64" />
          <h1 className="text-xl font-bold text-white">Staff Portal</h1>
          <p className="text-sm text-slate-400">Read-only clinic access</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
    </LoginLayout>
  );
}
