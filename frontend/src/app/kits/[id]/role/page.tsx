"use client";
import { use } from 'react';
import KitLayout, { useKit } from '@/components/KitLayout';
import { Target, List, Layers } from 'lucide-react';

function RoleDetailsContent() {
  const kit = useKit();
  const role = kit.role;
  
  if (!role) return <div className="p-8 text-gray-500">No role details available.</div>;

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-6 text-white tracking-tight">Role Details</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Target size={16} className="text-gray-400" /> Core Responsibilities
          </h3>
          <ul className="bg-[#111] border border-[#222] rounded-md p-5 space-y-3">
            {role.responsibilities?.map((res: string, i: number) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-3">
                <span className="text-gray-500 mt-0.5">•</span>
                <span className="leading-relaxed">{res}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <List size={16} className="text-gray-400" /> Key Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {role.requirements?.map((req: any, i: number) => (
              <div key={i} className="bg-[#111] border border-[#222] rounded-md p-4">
                <h4 className="text-white font-medium text-sm mb-1">{req.text || req.id}</h4>
                <p className="text-gray-400 text-xs capitalize">{req.priority} priority</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers size={16} className="text-gray-400" /> Expected Technical Knowledge
          </h3>
          <div className="bg-[#111] border border-[#222] rounded-md p-5 flex flex-wrap gap-2">
            {role.technical_skills?.map((skill: string, i: number) => (
              <span key={i} className="bg-[#222] text-gray-300 px-3 py-1 rounded text-xs font-medium border border-[#333]">
                {skill}
              </span>
            ))}
            {!role.technical_skills?.length && <span className="text-gray-500 text-sm">Not specified</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <KitLayout id={id}>
      <RoleDetailsContent />
    </KitLayout>
  );
}
