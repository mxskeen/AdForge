import { Loader2 } from 'lucide-react';

export function LoadingState() {
    return (
        <div className="card p-8 text-center">
            <Loader2 size={32} className="animate-spin mx-auto mb-4 text-neutral-500" />
            <p className="text-neutral-400">Generating campaign...</p>
            <p className="text-xs text-neutral-600 mt-2">This takes about 15-30 seconds</p>
        </div>
    );
}
