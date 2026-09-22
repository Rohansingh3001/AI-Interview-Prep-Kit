"use client";
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function PracticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [kit, setKit] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchWithAuth(`/kits/${id}`).then(setKit).catch(() => router.push('/dashboard'));
  }, [id, router]);

  if (!kit) return <div className="min-h-screen bg-[#000] flex items-center justify-center text-gray-500">Loading practice session...</div>;

  const items = [...(kit.flashcards || []), ...(kit.questions || [])];
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#000] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-2">No practice items available</h2>
        <p className="text-gray-500 mb-6">This kit doesn't have any flashcards or questions generated.</p>
        <Link href={`/kits/${id}`} className="text-white hover:underline text-sm font-medium">Return to Kit</Link>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const isQuestion = 'question' in currentItem;

  const handleNext = () => {
    setFlipped(false);
    if (currentIndex < items.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    setFlipped(false);
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-[#000] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#050505]">
        <Link href={`/kits/${id}`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
          <ArrowLeft size={16} /> Exit Practice
        </Link>
        <div className="text-gray-400 text-sm font-medium">
          <span className="text-white">{currentIndex + 1}</span> / {items.length}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex items-center justify-center max-w-4xl w-full mx-auto">
        <div 
          className="relative w-full aspect-[4/3] md:aspect-[2/1] perspective-1000 cursor-pointer"
          onClick={() => setFlipped(!flipped)}
        >
          <div 
            className="w-full h-full transition-transform duration-500"
            style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}
          >
            
            {/* Front */}
            <div 
              className="absolute w-full h-full bg-[#111] border border-[#333] rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-lg hover:border-gray-500 transition-colors"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <span className="absolute top-6 left-6 text-xs font-bold text-gray-500 uppercase tracking-wider bg-[#222] px-3 py-1.5 rounded-md">
                {isQuestion ? currentItem.category : currentItem.topic}
              </span>
              <h2 className="text-white font-medium text-2xl md:text-3xl leading-relaxed max-w-2xl">
                {isQuestion ? currentItem.prompt : currentItem.front}
              </h2>
              <span className="absolute bottom-6 text-gray-500 flex items-center gap-2 text-sm font-medium">
                <RefreshCcw size={14} /> Click to reveal answer
              </span>
            </div>
            
            {/* Back */}
            <div 
              className="absolute w-full h-full bg-[#1a1a1a] border border-[#444] rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-lg"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <span className="absolute top-6 left-6 text-xs font-bold text-gray-500 uppercase tracking-wider bg-[#222] px-3 py-1.5 rounded-md flex items-center gap-2">
                <Check size={14} className="text-green-500" /> Answer
              </span>
              <div className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-2xl overflow-y-auto max-h-[80%] whitespace-pre-wrap">
                {isQuestion ? currentItem.answer_outline : currentItem.back}
                
                {isQuestion && currentItem.key_points?.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-[#333] text-left">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Points to Hit</h4>
                    <ul className="list-disc list-inside text-gray-300 text-base space-y-2">
                      {currentItem.key_points.map((point: string, j: number) => (
                        <li key={j}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-6 border-t border-[#222] flex justify-center items-center gap-6 bg-[#050505]">
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#111] hover:bg-[#222] text-white border border-[#333]"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <button 
          onClick={handleNext} 
          disabled={currentIndex === items.length - 1}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-gray-200 text-black"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
