"use client";
import { use } from 'react';
import KitLayout, { useKit } from '@/components/KitLayout';
import { HelpCircle, Tag, TrendingUp } from 'lucide-react';

function QuestionsContent() {
  const kit = useKit();
  const questions = kit.questions || [];
  
  if (questions.length === 0) return <div className="p-8 text-gray-500">No questions available.</div>;

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-6 text-white tracking-tight">Interview Questions</h2>
      
      <div className="space-y-6">
        {questions.map((q: any, i: number) => (
          <div key={i} className="bg-[#111] border border-[#222] rounded-md overflow-hidden">
            <div className="p-5 border-b border-[#222] bg-[#151515]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-[#222] px-2 py-1 rounded">
                  {q.category}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                  q.difficulty >= 4 ? 'text-red-400 bg-red-400/10' :
                  q.difficulty <= 2 ? 'text-green-400 bg-green-400/10' :
                  'text-yellow-400 bg-yellow-400/10'
                }`}>
                  {q.difficulty >= 4 ? 'HARD' : q.difficulty <= 2 ? 'EASY' : 'MEDIUM'}
                </span>
              </div>
              <h3 className="text-white font-medium text-lg leading-relaxed mt-3">{q.prompt}</h3>
            </div>
            <div className="p-5">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <HelpCircle size={14} /> Suggested Answer
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{q.answer_outline}</p>
              
              {q.key_points && q.key_points.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#222]">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Tag size={14} /> Key Points to Hit
                  </h4>
                  <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                    {q.key_points.map((point: string, j: number) => (
                      <li key={j}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function QuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <KitLayout id={id}>
      <QuestionsContent />
    </KitLayout>
  );
}
