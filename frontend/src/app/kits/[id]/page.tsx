"use client";
import { use } from 'react';
import KitLayout, { useKit } from '@/components/KitLayout';

function CompanyBriefContent() {
  const kit = useKit();
  
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-6 text-white tracking-tight">About the Company</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Summary</h3>
          <div className="bg-[#111] border border-[#222] rounded-md p-5">
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{kit.companyBrief?.summary}</p>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">What they do</h3>
          <div className="bg-[#111] border border-[#222] rounded-md p-5">
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{kit.companyBrief?.what_they_do}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KitDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <KitLayout id={id}>
      <CompanyBriefContent />
    </KitLayout>
  );
}
