
import React, { useState } from 'react';
import { Note } from '../types';
import { generateVideoSummary } from '../services/geminiService';

interface VideoGeneratorProps {
  notes: Note[];
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({ notes }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const handleGenerate = async () => {
    if (notes.length === 0) return;
    setIsLoading(true);
    setVideoUrl(null);
    setStatus('Analyzing notes for visual concepts...');
    
    try {
      // Use the summary of all notes as the prompt
      const context = notes.map(n => n.title).join(", ");
      const result = await generateVideoSummary(context);
      setVideoUrl(result);
    } catch (e) {
      console.error(e);
      setStatus('Failed to generate video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-900 text-white text-center">
      {videoUrl ? (
        <div className="w-full max-w-4xl">
          <video controls autoPlay className="w-full rounded-2xl shadow-2xl mb-8">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <button onClick={() => setVideoUrl(null)} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">Generate New Visual</button>
        </div>
      ) : (
        <div className="max-w-2xl">
          <div className="bg-purple-500/20 p-6 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Cinematic Visual Explanations</h2>
          <p className="text-gray-400 mb-10 text-lg">NexusAI can generate high-quality 1080p video summaries of your study material using cutting-edge video models. Visual learning made simple.</p>
          
          <button 
            onClick={handleGenerate}
            disabled={isLoading || notes.length === 0}
            className="px-12 py-5 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 shadow-2xl transition-all disabled:opacity-50 text-xl"
          >
            {isLoading ? 'Cinematics in Progress...' : 'Generate Video Summary'}
          </button>
          
          {isLoading && (
            <div className="mt-10 space-y-4">
              <p className="text-purple-400 font-medium animate-pulse">{status}</p>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 animate-[loading_20s_ease-in-out_infinite]"></div>
              </div>
              <p className="text-xs text-gray-500 italic">This usually takes about 1-2 minutes. Stay tuned!</p>
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};
