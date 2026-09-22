"use client";
import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Loader2, Play, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

export const KitContext = createContext<any>(null);

export function useKit() {
  return useContext(KitContext);
}

export default function KitLayout({ children, id }: { children: React.ReactNode, id: string }) {
  const [kit, setKit] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchKit = async () => {
      try {
        const data = await fetchWithAuth(`/kits/${id}`);
        setKit(data);
      } catch (err) {
        router.push('/dashboard');
      }
    };
    
    fetchKit();
    const interval = setInterval(() => {
      if (kit && (kit.status === 'queued' || kit.status === 'generating')) {
        fetchKit();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [id, router, kit?.status]);

  if (!kit) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gray-500" /></div>;

  if (kit.status !== 'completed' && kit.status !== 'failed') {
    return (
      <div className="min-h-screen p-8 max-w-3xl mx-auto flex flex-col items-center justify-center">
        <div className="glass-panel p-16 w-full text-center bg-[#0a0a0a]">
          <Loader2 size={48} className="animate-spin text-white mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4 text-white">Generating preparation kit</h2>
          <div className="text-left max-w-xs mx-auto mt-8 space-y-4 text-sm font-medium">
            <p className="flex items-center gap-3 text-white"><CheckCircle size={16} /> Reading job description</p>
            <p className="flex items-center gap-3 text-white"><CheckCircle size={16} /> Extracting requirements</p>
            <p className="flex items-center gap-3 text-gray-400"><Loader2 size={16} className="animate-spin" /> Researching company</p>
            <p className="flex items-center gap-3 text-gray-600"><span className="inline-block w-4" /> Generating questions</p>
            <p className="flex items-center gap-3 text-gray-600"><span className="inline-block w-4" /> Building study schedule</p>
          </div>
        </div>
      </div>
    );
  }

  if (kit.status === 'failed') {
    return (
      <div className="min-h-screen p-8 max-w-3xl mx-auto flex flex-col items-center justify-center">
        <div className="glass-panel p-12 w-full text-center border-red-900/50 bg-[#0a0a0a]">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-white">Generation Failed</h2>
          <p className="text-gray-400 mb-8 text-sm">There was an error generating your kit. Please try again.</p>
          <Link href="/dashboard" className="bg-white hover:bg-gray-200 text-black px-6 py-2.5 rounded-md text-sm font-semibold transition-colors">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const isTabActive = (path: string) => {
    if (path === `/kits/${id}` && pathname === path) return true;
    if (path !== `/kits/${id}` && pathname.startsWith(path)) return true;
    return false;
  };

  const tabs = [
    { name: 'Company Brief', path: `/kits/${id}` },
    { name: 'Role Details', path: `/kits/${id}/role` },
    { name: 'Questions', path: `/kits/${id}/questions` },
    { name: 'Flashcards', path: `/kits/${id}/flashcards` },
    { name: 'Study Plan', path: `/kits/${id}/schedule` },
  ];

  return (
    <KitContext.Provider value={kit}>
      <div className="min-h-screen p-8 max-w-5xl mx-auto">
        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors mb-6 inline-flex items-center gap-2 text-sm font-medium">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        
        <div className="glass-panel overflow-hidden bg-[#0a0a0a]">
          <div className="p-8 border-b border-[#222] bg-[#050505] flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{kit.role?.title || kit.source?.role}</h1>
              <p className="text-gray-400 text-sm font-medium">{kit.companyBrief?.summary?.substring(0, 50) || kit.source?.company} &bull; {kit.schedule?.days_available || 5} days left</p>
            </div>
            <Link href={`/kits/${id}/practice`} className="bg-white hover:bg-gray-200 text-black px-6 py-2.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors">
              <Play size={16} fill="currentColor" /> Start Practice
            </Link>
          </div>
          
          <div className="flex border-b border-[#222] overflow-x-auto text-sm font-medium">
            {tabs.map((tab) => (
              <Link 
                key={tab.path}
                href={tab.path} 
                className={`px-6 py-4 whitespace-nowrap transition-colors ${
                  isTabActive(tab.path) 
                    ? 'text-white border-b-2 border-white' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </div>
          
          {children}
          
          <div className="p-6 bg-[#050505] border-t border-[#222] text-xs font-medium text-gray-500 flex justify-between uppercase tracking-wider mt-auto">
            <span className="flex items-center gap-2"><FileText size={14} /> Coverage: {kit.coverage?.uncovered_requirement_ids?.length === 0 ? '100%' : 'Partial'}</span>
            <span>Reqs: {kit.role?.requirements?.length || 0} | Qs: {kit.questions?.length || 0}</span>
          </div>
        </div>
      </div>
    </KitContext.Provider>
  );
}
