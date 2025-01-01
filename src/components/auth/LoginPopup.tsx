import React from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../hooks/useAuth';

type AuthMode = 'login' | 'signup';

export const LoginPopup: React.FC = () => {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = React.useState(false);
  const [mode, setMode] = React.useState<AuthMode>('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            setError('This email is already registered. Please log in instead.');
            setMode('login');
          } else {
            throw signUpError;
          }
        } else {
          setSuccess('Account created successfully! You can now log in.');
          setMode('login');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
        setShowPopup(false);
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setSuccess('');
  };

  if (user) {
    return (
      <button
        onClick={handleLogout}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Logout"
      >
        <LogOut className="w-6 h-6 text-red-500" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Login"
      >
        <LogIn className="w-6 h-6 text-green-500" />
      </button>

      {showPopup && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring focus:ring-teal-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring focus:ring-teal-200"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            {success && (
              <div className="text-green-500 text-sm">{success}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white rounded-md px-4 py-2 hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
            </button>
            <button
              type="button"
              onClick={toggleMode}
              className="w-full text-sm text-teal-600 hover:text-teal-700"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Log in'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
