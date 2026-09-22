"use client";
import { use } from 'react';
import KitLayout, { useKit } from '@/components/KitLayout';
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';

function ScheduleContent() {
  const kit = useKit();
  const schedule = kit.schedule?.days || [];
  
  if (schedule.length === 0) return <div className="p-8 text-gray-500">No study plan available.</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight">Study Plan</h2>
        <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <CalendarIcon size={16} /> {kit.schedule?.days_available} Days Total
        </span>
      </div>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#333] before:to-transparent">
        {schedule.map((dayPlan: any, i: number) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#333] bg-[#0a0a0a] text-gray-400 group-hover:text-white group-hover:border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
              <span className="text-sm font-bold">{dayPlan.day}</span>
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#111] border border-[#222] p-5 rounded-md shadow-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                <h3 className="text-white font-medium text-lg leading-tight">{dayPlan.focus}</h3>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1 shrink-0 bg-[#222] px-2 py-1 rounded">
                  <Clock size={12} /> {(dayPlan.minutes / 60).toFixed(1)} hrs
                </span>
              </div>
              
              <ul className="space-y-2 mt-4 pt-4 border-t border-[#222]">
                <li className="text-gray-300 text-sm flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-gray-500 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">Practice Questions: {dayPlan.question_ids?.length || 0} questions</span>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <KitLayout id={id}>
      <ScheduleContent />
    </KitLayout>
  );
}
