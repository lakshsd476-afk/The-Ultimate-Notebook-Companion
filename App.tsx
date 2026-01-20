
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/ChatInterface';
import { FlashcardGrid } from './components/FlashcardGrid';
import { AudioLesson } from './components/AudioLesson';
import { VideoGenerator } from './components/VideoGenerator';
import { NoteEditor } from './components/NoteEditor';
import { LinkedInPortfolio } from './components/LinkedInPortfolio';
import { Note, AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CHAT);
  const [notes, setNotes] = useState<Note[]>([]);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      const selected = await (window as any).aistudio?.hasSelectedApiKey?.();
      setHasApiKey(!!selected);
    };
    checkKey();
  }, []);

  const handleAddNote = (newNote: Omit<Note, 'id' | 'createdAt'>) => {
    const note: Note = {
      ...newNote,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    setNotes(prev => [...prev, note]);
  };

  const removeNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const openKeySelection = async () => {
    await (window as any).aistudio?.openSelectKey?.();
    setHasApiKey(true);
  };

  const getSourceIcon = (type: Note['type']) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'url': return '🔗';
      case 'image': return '🖼️';
      case 'file': return '📁';
      default: return '📝';
    }
  };

  return (
    <Layout 
      sidebar={
        <>
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-black text-blue-600 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-lg">N</span>
              NexusAI
            </h1>
          </div>
          
          <NoteEditor onAddNote={handleAddNote} />

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <h3 className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Your Sources ({notes.length})</h3>
            {notes.length === 0 ? (
              <div className="px-2 py-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-sm text-gray-400">Add documents, links, or notes to get started.</p>
              </div>
            ) : (
              notes.map(note => (
                <div key={note.id} className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm group hover:border-blue-400 transition-all hover:shadow-md">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-lg flex-shrink-0">{getSourceIcon(note.type)}</span>
                      <h4 className="font-bold text-sm truncate text-gray-800">{note.title}</h4>
                    </div>
                    <button onClick={() => removeNote(note.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase mt-1">
                    {note.type} • {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {!hasApiKey && (
            <div className="m-4 p-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl">
              <p className="text-xs text-orange-800 mb-3 font-semibold">Unlock cinematic visuals & high-res AI generation.</p>
              <button 
                onClick={openKeySelection}
                className="w-full py-2 bg-orange-500 text-white rounded-xl text-xs font-black hover:bg-orange-600 shadow-sm active:scale-95 transition-all"
              >
                Enable Premium
              </button>
            </div>
          )}
        </>
      }
    >
      <nav className="flex items-center px-8 border-b border-gray-200 gap-8 overflow-x-auto bg-white/80 backdrop-blur sticky top-0 z-10 no-scrollbar">
        {[AppTab.CHAT, AppTab.FLASHCARDS, AppTab.AUDIO, AppTab.VIDEO, 'Career Growth'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`py-5 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab || (tab === 'Career Growth' && activeTab === ('Career Growth' as any))
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="flex-1 relative overflow-hidden bg-white">
        {activeTab === AppTab.CHAT && <ChatInterface notes={notes} />}
        {activeTab === AppTab.FLASHCARDS && <FlashcardGrid notes={notes} />}
        {activeTab === AppTab.AUDIO && <AudioLesson notes={notes} />}
        {activeTab === AppTab.VIDEO && <VideoGenerator notes={notes} />}
        {activeTab === ('Career Growth' as any) && <LinkedInPortfolio />}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </Layout>
  );
};

export default App;
