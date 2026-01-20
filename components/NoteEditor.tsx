
import React, { useState, useRef } from 'react';
import { Note } from '../types';

interface NoteEditorProps {
  onAddNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
}

type SourceType = 'text' | 'file' | 'url';

export const NoteEditor: React.FC<NoteEditorProps> = ({ onAddNote }) => {
  const [activeType, setActiveType] = useState<SourceType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setUrl('');
    setIsOpen(false);
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setTitle(file.name);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const base64Data = base64.split(',')[1];
      
      onAddNote({
        title: file.name,
        content: `File: ${file.name} (${file.type})`,
        type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'file',
        metadata: {
          mimeType: file.type,
          data: base64Data
        }
      });
      resetForm();
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeType === 'text') {
      if (!title || !content) return;
      onAddNote({ title, content, type: 'text' });
    } else if (activeType === 'url') {
      if (!url) return;
      onAddNote({ 
        title: title || url, 
        content: `Link: ${url}`, 
        type: 'url',
        metadata: { url }
      });
    }
    resetForm();
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add Source
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(['text', 'file', 'url'] as SourceType[]).map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${
                  activeType === t ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {activeType === 'text' && (
              <>
                <input
                  type="text"
                  placeholder="Note Title"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
                <textarea
                  placeholder="Paste content..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </>
            )}

            {activeType === 'file' && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept=".pdf,.txt,.md,image/*"
                />
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700">Click to upload</p>
                <p className="text-xs text-gray-400 mt-1">PDF, TXT, MD, or Images</p>
                {isProcessing && <p className="text-xs text-blue-600 mt-2 animate-pulse">Processing file...</p>}
              </div>
            )}

            {activeType === 'url' && (
              <>
                <input
                  type="text"
                  placeholder="Source Name (Optional)"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  type="url"
                  placeholder="https://example.com/article"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  autoFocus
                />
              </>
            )}

            {activeType !== 'file' && (
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="px-6 py-2 text-sm bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-all active:scale-95"
                >
                  Add Source
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
