"use client";
import { use, useState } from 'react';
import KitLayout, { useKit } from '@/components/KitLayout';
import { RefreshCcw } from 'lucide-react';

function Flashcard({ card }: { card: any }) {
  const [flipped, setFlipped] = useState(false);
  
  return (
    <div 
      className="relative w-full h-64 perspective-1000 cursor-pointer group"
      onClick={() => setFlipped(!flipped)}
    >
      <div 
        className="w-full h-full transition-transform duration-500"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}
      >
        
        {/* Front */}
        <div 
          className="absolute w-full h-full bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm group-hover:border-[#333] transition-colors"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <span className="absolute top-4 left-4 text-xs font-bold text-gray-500 uppercase tracking-wider bg-[#222] px-2 py-1 rounded">
            {card.topic}
          </span>
          <h3 className="text-white font-medium text-lg leading-relaxed">{card.front}</h3>
          <span className="absolute bottom-4 right-4 text-gray-600 flex items-center gap-1 text-xs">
            <RefreshCcw size={12} /> Click to flip
          </span>
        </div>
        
        {/* Back */}
        <div 
          className="absolute w-full h-full bg-[#1a1a1a] border border-[#333] rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-gray-200 text-sm leading-relaxed overflow-y-auto">{card.back}</p>
        </div>
        
      </div>
    </div>
  );
}

function FlashcardsContent() {
  const kit = useKit();
  const flashcards = kit.flashcards || [];
  
  if (flashcards.length === 0) return <div className="p-8 text-gray-500">No flashcards available.</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Study Flashcards</h2>
        <span className="text-sm font-medium text-gray-500">{flashcards.length} cards</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashcards.map((card: any, i: number) => (
          <Flashcard key={i} card={card} />
        ))}
      </div>
    </div>
  );
}

export default function FlashcardsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <KitLayout id={id}>
      <FlashcardsContent />
    </KitLayout>
  );
}
