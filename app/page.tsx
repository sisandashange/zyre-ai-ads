'use client';

import { useState } from 'react';

export default function VideoAdGenerator() {
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setVideoUrl('');
    setStatusMessage('Step 1/3: AI is writing your structured ad script...');

    try {
      // 1. Generate Script
      const scriptRes = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const scriptData = await scriptRes.json();

      if (!scriptRes.ok) throw new Error(scriptData.error || 'Failed to generate script');

      setStatusMessage('Step 2/3: Generating video scenes and voiceover...');

      // 2. Generate Video using the script
      const videoRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: scriptData.script }),
      });
      const videoData = await videoRes.json();

      if (!videoRes.ok) throw new Error(videoData.error || 'Failed to generate video');

      setVideoUrl(videoData.videoUrl);
      setStatusMessage('Step 3/3: Video ad generated successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
      setStatusMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">AI Video Ad Generator</h1>
        <p className="text-slate-400 mb-8">
          Turn your text prompts and product images into 30–60 second video advertisements for your business.
        </p>

        <form onSubmit={handleGenerate} className="space-y-6 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div>
            <label className="block text-sm font-medium mb-2">1. Describe your video ad</label>
            <textarea
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              rows={4}
              placeholder="e.g., A 30-second energetic commercial for a coffee brand, highlighting fresh beans and morning energy..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">2. Upload a Product Image or Logo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition font-medium py-3 rounded-lg text-white disabled:opacity-50"
          >
            {loading ? statusMessage : 'Generate Video Ad'}
          </button>
        </form>

        {videoUrl && (
          <div className="mt-8 bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
            <h2 className="text-xl font-semibold mb-4">Your Video is Ready!</h2>
            <video controls className="w-full rounded-lg" src={videoUrl} />
          </div>
        )}
      </div>
    </main>
  );
}
