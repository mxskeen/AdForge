import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { UploadZone } from './components/UploadZone';
import { LoadingState } from './components/LoadingState';
import { CampaignResults } from './components/CampaignResults';
import { Carousel } from './components/Carousel';
import './index.css';

function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generate = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image,
          style: 'professional',
          user_prompt: userPrompt
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to generate');
      }

      setResult(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-2xl space-y-10">

          <header className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800">
              <Sparkles size={12} className="text-yellow-400" />
              <span className="text-xs font-medium text-neutral-400">Powered by AWS Bedrock</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 pb-2">
              AdForge
            </h1>
            <p className="text-lg text-neutral-400 max-w-md mx-auto leading-relaxed">
              Transform product photos into world-class marketing campaigns in seconds.
            </p>
          </header>

          {result ? (
            <CampaignResults data={result} onReset={reset} />
          ) : loading ? (
            <LoadingState />
          ) : (
            <div className="space-y-8">
              <UploadZone onImageSelect={setImage} disabled={loading} />

              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {image && (
                <div className="text-center pt-2">
                  <button onClick={generate} className="btn-primary px-8 py-4 text-lg shadow-lg shadow-white/10">
                    Generate Campaign
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {!result && !loading && !image && (
        <div className="border-t border-neutral-900 bg-neutral-950/50 backdrop-blur-3xl">
          <Carousel />
        </div>
      )}

      <footer className="py-8 text-center text-xs text-neutral-600">
        Built with <span className="text-neutral-400">AWS Bedrock</span> • Nova Lite • Nova Canvas
      </footer>
    </div>
  );
}

export default App;
