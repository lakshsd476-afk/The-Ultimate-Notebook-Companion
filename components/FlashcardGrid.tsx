
import React, { useState } from 'react';
import { Note, Flashcard } from '../types';
import { generateFlashcards } from '../services/geminiService';

interface FlashcardGridProps {
  notes: Note[];
}

export const FlashcardGrid: React.FC<FlashcardGridProps> = ({ notes }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flipped, setFlipped] = useState<number[]>([]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generateFlashcards(notes);
      setCards(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFlip = (idx: number) => {
    setFlipped(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  if (cards.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="bg-blue-50 p-6 rounded-full mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Master Your Content</h2>
        <p className="text-gray-500 max-w-md mb-8">Generate AI-powered flashcards from your notes to test your knowledge and improve retention.</p>
        <button 
          onClick={handleGenerate}
          disabled={isLoading || notes.length === 0}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all disabled:opacity-50"
        >
          {isLoading ? 'Generating cards...' : 'Generate 10 Study Cards'}
        </button>
        {notes.length === 0 && <p className="mt-4 text-xs text-red-500 font-medium">Add some notes first!</p>}
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Your Flashcards</h2>
        <button onClick={handleGenerate} className="text-blue-600 font-medium hover:underline">Regenerate</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div 
            key={idx} 
            onClick={() => toggleFlip(idx)}
            className="h-64 cursor-pointer perspective"
          >
            <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${flipped.includes(idx) ? 'rotate-y-180' : ''}`}>
              <div className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center p-6 text-center backface-hidden">
                <p className="text-lg font-semibold text-gray-800">{card.question}</p>
              </div>
              <div className="absolute inset-0 w-full h-full bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center p-6 text-center backface-hidden rotate-y-180">
                <p className="text-lg">{card.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .perspective { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
