"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, FileText, UploadCloud, Loader2 } from 'lucide-react';

export default function NewKit() {
  const [jd, setJd] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [days, setDays] = useState(5);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchWithAuth('/kits', {
        method: 'POST',
        body: JSON.stringify({ jd, companyUrl, days })
      });
      router.push(`/kits/${data.kitId}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/upload-jd`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      if (data.text) {
        setJd(data.text);
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to extract text from file.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
          <ArrowLeft size={16} /> Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">Create Interview Kit</h1>
      <p className="text-gray-400 mb-8 text-sm">Provide the job description and company details to generate your tailored preparation plan.</p>

      <div className="glass-panel p-8 bg-[#0a0a0a]">
        <form onSubmit={handleCreate} className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-semibold text-white tracking-wide uppercase">Job Description</label>
              
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 text-xs font-medium bg-[#111] hover:bg-[#222] border border-[#333] px-3 py-1.5 rounded-md transition-colors text-gray-300"
              >
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                {uploading ? 'Extracting...' : 'Attach Document'}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" 
                onChange={handleFileUpload} 
              />
            </div>
            
            <textarea 
              className="w-full h-48 bg-[#050505] border border-[#222] rounded-lg p-4 text-gray-300 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all font-mono text-sm leading-relaxed resize-none"
              placeholder="Paste the job description or upload a document..."
              value={jd}
              onChange={e => setJd(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-3 text-white tracking-wide uppercase">Company Website</label>
              <input 
                type="url" 
                className="w-full bg-[#050505] border border-[#222] rounded-lg p-3 text-gray-300 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all text-sm"
                placeholder="https://company.com"
                value={companyUrl}
                onChange={e => setCompanyUrl(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3 text-white tracking-wide uppercase">Preparation Days</label>
              <input 
                type="number" 
                min="1"
                max="60"
                className="w-full bg-[#050505] border border-[#222] rounded-lg p-3 text-gray-300 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all text-sm"
                value={days}
                onChange={e => setDays(parseInt(e.target.value))}
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !jd || !companyUrl}
            className="w-full bg-white hover:bg-gray-200 text-black disabled:bg-[#222] disabled:text-gray-500 font-semibold py-3.5 rounded-lg transition-colors mt-6 text-sm flex justify-center items-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : "Generate Kit"}
          </button>
        </form>
      </div>
    </div>
  );
}
