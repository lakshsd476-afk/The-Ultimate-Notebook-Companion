
import React, { useState } from 'react';

export const LinkedInPortfolio: React.FC = () => {
  const currentUrl = window.location.href;
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const templates = [
    {
      id: 'template-1',
      title: 'For the "Featured" Section (Short & Punchy)',
      content: `🚀 I built a personal AI Workspace using Gemini 3! \n\nI created NexusAI to transform how I learn. It generates custom flashcards, audio lectures, and video summaries from my notes in seconds. Check out my live build here: ${currentUrl}`
    },
    {
      id: 'template-2',
      title: 'For the "Experience/Projects" Section (Professional)',
      content: `Developed "NexusAI," a high-performance AI learning ecosystem leveraging the @Google Gemini API. \n\nKey features include:\n• Retrieval-Augmented Generation (RAG) for multi-source knowledge retrieval.\n• Automated multi-modal content creation (Text-to-Speech & Video Generation via Veo).\n• Integrated flashcard generation for cognitive reinforcement.\n\nBuilt with React, TypeScript, and Tailwind CSS.`
    },
    {
      id: 'template-3',
      title: 'For a "Standard Post" (Engaging)',
      content: `Stop taking passive notes. Start building active knowledge. 🧠\n\nI just finished building NexusAI—an exact replica of the power behind NotebookLM, tailored for my personal study flow. It takes my messy notes and turns them into 1080p video summaries and audio guides using the latest Gemini models.\n\nTechnical stack: #GeminiAPI #React #GenerativeAI #EdTech\n\nTry it out: ${currentUrl}`
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12 bg-white h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-block bg-[#0077b5] p-4 rounded-2xl shadow-lg mb-2">
          <svg className="w-10 h-10 text-white fill-current" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Boost Your Professional Presence</h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Your NexusAI instance is a powerful portfolio piece. Here is how to present it to recruiters and peers to showcase your technical edge.
        </p>
      </div>

      {/* Step by Step Guide */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">Where to add the link?</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 border rounded-xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-blue-600 mb-1">Featured Section (Best)</h4>
            <p className="text-sm text-gray-600">This puts a large visual card at the top of your profile. Add as a "Link" and use one of the templates below.</p>
          </div>
          <div className="p-5 border rounded-xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-blue-600 mb-1">Contact Info</h4>
            <p className="text-sm text-gray-600">Add it as a "Personal Website" in your contact information section for long-term accessibility.</p>
          </div>
          <div className="p-5 border rounded-xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-blue-600 mb-1">About Section</h4>
            <p className="text-sm text-gray-600">Mention it as a "Recent Project" in your bio to demonstrate hands-on experience with LLMs.</p>
          </div>
          <div className="p-5 border rounded-xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-blue-600 mb-1">Education/Experience</h4>
            <p className="text-sm text-gray-600">Attach the link to your University or current Job entry to show how you innovate internally.</p>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">Copy-Paste Templates</h3>
        <div className="space-y-6">
          {templates.map((t) => (
            <div key={t.id} className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                <span className="font-semibold text-gray-700">{t.title}</span>
                <button 
                  onClick={() => copyToClipboard(t.content, t.id)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    copied === t.id ? 'bg-green-500 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {copied === t.id ? 'Copied!' : 'Copy Text'}
                </button>
              </div>
              <div className="p-6">
                <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans italic leading-relaxed">
                  "{t.content}"
                </pre>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Practices */}
      <section className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Best Practices for Maximum Impact
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="bg-blue-400/30 p-1 rounded-full h-fit mt-1">✓</span>
              <div>
                <span className="font-bold block">Use Screen Captures</span>
                <span className="text-blue-100 text-sm">When posting, record a 15-second screen capture of the AI generating a video summary. Visuals stop the scroll.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-blue-400/30 p-1 rounded-full h-fit mt-1">✓</span>
              <div>
                <span className="font-bold block">Tag Google Gemini</span>
                <span className="text-blue-100 text-sm">Mentioning @Google and @Gemini in your post can increase reach within the AI community.</span>
              </div>
            </li>
          </ul>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="bg-blue-400/30 p-1 rounded-full h-fit mt-1">✓</span>
              <div>
                <span className="font-bold block">Update Regularly</span>
                <span className="text-blue-100 text-sm">As you add more notes and sources, share your findings. Consistency builds authority.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-blue-400/30 p-1 rounded-full h-fit mt-1">✓</span>
              <div>
                <span className="font-bold block">Explain the "Why"</span>
                <span className="text-blue-100 text-sm">Don't just say what it does—say why it helps. Focus on efficiency, productivity, and learning outcomes.</span>
              </div>
            </li>
          </ul>
        </div>
        <div className="mt-10 text-center">
          <button 
            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`)}
            className="px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-lg hover:bg-gray-100 transition-transform active:scale-95 shadow-lg"
          >
            Launch Final Post to LinkedIn
          </button>
        </div>
      </section>
    </div>
  );
};
