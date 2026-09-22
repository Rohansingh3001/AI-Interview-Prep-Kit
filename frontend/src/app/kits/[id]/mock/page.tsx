"use client";
import { use, useState, useEffect, useRef } from 'react';
import KitLayout, { useKit } from '@/components/KitLayout';
import { fetchWithAuth } from '@/lib/api';
import { Mic, MicOff, Play, Send, ChevronRight, Loader2, Volume2, CheckCircle2, TrendingUp } from 'lucide-react';

// Define a type for Web Speech API to avoid TS errors
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function MockInterviewContent({ id }: { id: string }) {
  const kit = useKit();
  const questions = kit.questions || [];
  
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };
      }
      
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel(); // Stop current speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support Speech Recognition. Please try Chrome or Edge.");
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const startInterview = () => {
    setStarted(true);
    const q = questions[0];
    if (q) speakText(q.prompt);
  };

  const nextQuestion = () => {
    setTranscript('');
    setEvaluation(null);
    const nextIdx = currentIdx + 1;
    setCurrentIdx(nextIdx);
    if (questions[nextIdx]) {
      speakText(questions[nextIdx].prompt);
    }
  };

  const submitAnswer = async () => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    
    if (!transcript.trim()) return;
    
    setIsEvaluating(true);
    const q = questions[currentIdx];
    
    try {
      const result = await fetchWithAuth(`/kits/${id}/evaluate`, {
        method: 'POST',
        body: JSON.stringify({
          question: q.prompt,
          suggestedAnswer: q.answer_outline,
          keyPoints: q.key_points,
          userAnswer: transcript
        })
      });
      
      setEvaluation(result);
      speakText(`You scored ${result.score} out of 10. ${result.feedback}`);
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate answer");
    } finally {
      setIsEvaluating(false);
    }
  };

  if (questions.length === 0) {
    return <div className="p-8 text-gray-500">No questions available for mock interview.</div>;
  }

  if (!started) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-[#111] rounded-full border border-[#333] flex items-center justify-center mb-6">
          <Mic size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Voice-Based Mock Interview</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
          The AI will read the questions aloud. You can use your microphone to answer them as if you were in a real interview. The AI will listen and evaluate your responses instantly!
        </p>
        <button 
          onClick={startInterview}
          className="bg-white hover:bg-gray-200 text-black px-8 py-3 rounded-md font-semibold flex items-center gap-2 transition-colors"
        >
          <Play size={18} fill="currentColor" /> Start Interview
        </button>
      </div>
    );
  }

  const isComplete = currentIdx >= questions.length;
  if (isComplete) {
    return (
      <div className="p-12 text-center">
        <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Interview Complete!</h2>
        <p className="text-gray-400 mb-8">You've finished all the questions.</p>
        <button onClick={() => window.location.reload()} className="bg-[#111] border border-[#333] hover:bg-[#222] text-white px-6 py-2 rounded-md font-medium transition-colors">
          Start Over
        </button>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col gap-8">
      {/* Progress */}
      <div className="flex items-center gap-4">
        <div className="text-xs font-bold text-gray-500 tracking-wider">
          QUESTION {currentIdx + 1} OF {questions.length}
        </div>
        <div className="h-1 flex-1 bg-[#222] rounded-full overflow-hidden">
          <div className="h-full bg-white transition-all duration-500" style={{ width: `${((currentIdx) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-8 relative shadow-sm">
        <span className="absolute top-6 right-6 text-xs font-bold text-gray-500 uppercase tracking-wider bg-[#222] px-3 py-1 rounded">
          {q.category}
        </span>
        <h2 className="text-2xl md:text-3xl text-white font-medium leading-relaxed pr-24 mt-2">
          {q.prompt}
        </h2>
        
        <button 
          onClick={() => speakText(q.prompt)} 
          className={`mt-6 flex items-center gap-2 text-sm font-medium transition-colors ${isSpeaking ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
        >
          <Volume2 size={16} /> {isSpeaking ? 'Speaking...' : 'Read Aloud'}
        </button>
      </div>

      {!evaluation ? (
        /* Recording Area */
        <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-8 flex flex-col items-center shadow-inner">
          <div className="w-full bg-[#111] border border-[#333] rounded-lg p-6 min-h-[160px] mb-6 text-gray-300 leading-relaxed font-mono text-sm relative">
            {transcript || <span className="text-gray-600 italic">Click the microphone and start speaking...</span>}
            {isRecording && <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse"></span>}
          </div>
          
          <div className="flex items-center gap-4 w-full justify-center">
            <button 
              onClick={toggleRecording}
              className={`flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
                isRecording 
                  ? 'bg-red-500/20 text-red-500 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                  : 'bg-[#111] border border-[#333] text-white hover:bg-[#222]'
              }`}
            >
              {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            
            <button 
              onClick={submitAnswer}
              disabled={!transcript.trim() || isEvaluating}
              className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEvaluating ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              {isEvaluating ? 'Evaluating...' : 'Submit Answer'}
            </button>
          </div>
        </div>
      ) : (
        /* Evaluation Feedback */
        <div className="bg-[#111] border border-[#333] rounded-xl p-8 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-start gap-6">
            <div className={`flex flex-col items-center justify-center w-24 h-24 rounded-full shrink-0 border-4 ${
              evaluation.score >= 8 ? 'border-green-500 text-green-500' :
              evaluation.score >= 5 ? 'border-yellow-500 text-yellow-500' :
              'border-red-500 text-red-500'
            }`}>
              <span className="text-3xl font-bold">{evaluation.score}</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">/ 10</span>
            </div>
            
            <div className="flex-1 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-green-400 flex items-center gap-2 uppercase tracking-wider mb-2">
                  <CheckCircle2 size={16} /> What you did well
                </h4>
                <p className="text-gray-300 leading-relaxed text-sm">{evaluation.feedback}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-yellow-400 flex items-center gap-2 uppercase tracking-wider mb-2">
                  <TrendingUp size={16} /> How to improve
                </h4>
                <p className="text-gray-300 leading-relaxed text-sm">{evaluation.improvements}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#222] flex justify-end">
            <button 
              onClick={nextQuestion}
              className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-md font-semibold flex items-center gap-2 transition-colors"
            >
              Next Question <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MockInterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <KitLayout id={id}>
      <MockInterviewContent id={id} />
    </KitLayout>
  );
}
