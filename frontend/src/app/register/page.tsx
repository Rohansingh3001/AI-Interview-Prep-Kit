"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass-panel p-10 w-full max-w-md bg-[#0a0a0a]">
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
        <p className="text-gray-400 mb-8 text-sm">Join to generate tailored interview prep kits</p>
        
        {error && <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-md mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold mb-2 text-white uppercase tracking-wide">Email</label>
            <input 
              type="email" 
              className="w-full bg-[#111] border border-[#222] rounded-md p-3 text-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2 text-white uppercase tracking-wide">Password</label>
            <input 
              type="password" 
              className="w-full bg-[#111] border border-[#222] rounded-md p-3 text-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-3 rounded-md transition-colors mt-2 text-sm flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Register"}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account? <Link href="/" className="text-white hover:underline font-medium">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
