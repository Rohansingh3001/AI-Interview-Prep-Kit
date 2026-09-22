"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import { Plus, Briefcase, Calendar, Layers, Activity } from 'lucide-react';

export default function Dashboard() {
  const [kits, setKits] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchWithAuth('/kits').then(setKits).catch(() => router.push('/'));
  }, [router]);

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-white tracking-tight">Interview Kits</h1>
        <Link href="/kits/new" className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-md transition-colors text-sm font-semibold flex items-center gap-2 shadow-sm">
          <Plus size={16} /> Create Kit
        </Link>
      </div>

      {kits.length === 0 ? (
        <div className="glass-panel p-16 flex flex-col items-center justify-center text-center">
          <Briefcase size={48} className="text-gray-700 mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">No kits yet</h2>
          <p className="text-gray-400 mb-6 max-w-md">Create your first interview preparation kit by analyzing a job description and company website.</p>
          <Link href="/kits/new" className="bg-white hover:bg-gray-200 text-black px-6 py-2.5 rounded-md transition-colors text-sm font-semibold">
            Get Started
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kits.map(kit => (
            <div key={kit._id} className="glass-panel p-6 hover:border-gray-600 transition-all group cursor-pointer relative bg-[#0a0a0a]" onClick={() => router.push(`/kits/${kit._id}`)}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1 leading-tight">{kit.source?.company || 'Unknown Company'}</h2>
                  <p className="text-gray-400 text-sm font-medium">{kit.source?.role || 'Unknown Role'}</p>
                </div>
                <div className={`p-1.5 rounded-md ${kit.status === 'completed' ? 'bg-green-500/10 text-green-500' : kit.status === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  <Activity size={16} />
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mb-4 bg-[#111] p-3 rounded-md border border-[#222]">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-white font-bold text-lg">{kit.questions?.length || 0}</span>
                  <span className="uppercase tracking-wider">Questions</span>
                </div>
                <div className="w-px bg-[#333]"></div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-white font-bold text-lg">{kit.flashcards?.length || 0}</span>
                  <span className="uppercase tracking-wider">Cards</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-[#222]">
                <span className="capitalize font-medium">{kit.status}</span>
                <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(kit.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
