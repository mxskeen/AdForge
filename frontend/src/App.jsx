import { useState } from 'react';
import { Zap } from 'lucide-react';
import { UploadZone } from './components/UploadZone';
import { LoadingState } from './components/LoadingState';
import { CampaignResults } from './components/CampaignResults';
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
      const res = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, style: 'professional' }),
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
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-xl space-y-12">
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Zap size={28} className="text-white" />
            <h1 className="text-4xl font-bold tracking-tight">AdForge</h1>
          </div>
          <p className="text-neutral-500 text-lg">
            Product photo to marketing campaign
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
              <div className="card p-4 border-red-900 bg-red-950/30 text-center">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {image && (
              <div className="text-center pt-4">
                <button onClick={generate} className="btn-primary w-full py-4 rounded-xl text-base font-medium">
                  Generate Campaign
                </button>
              </div>
            )}
          </div>
        )}

        <footer className="text-center text-xs text-neutral-800 pt-8">
          Built with AWS Bedrock
        </footer>
      </div>
    </div>
  );
}

export default App;
