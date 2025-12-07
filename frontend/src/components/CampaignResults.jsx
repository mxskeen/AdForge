import { Download, Copy, Check, RefreshCw } from 'lucide-react';
import { useState } from 'react';

function CopyBtn({ text }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={copy} className="p-1 hover:bg-neutral-800 rounded">
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-neutral-500" />}
        </button>
    );
}

function CopyCard({ label, content }) {
    return (
        <div className="card p-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-neutral-500 uppercase tracking-wide">{label}</span>
                <CopyBtn text={content} />
            </div>
            <p className="text-sm text-neutral-300">{content}</p>
        </div>
    );
}

export function CampaignResults({ data, onReset }) {
    const { product_analysis, marketing_copy, styled_image, original_image } = data;

    const download = () => {
        if (!styled_image) return;
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${styled_image}`;
        link.download = `adforge-${product_analysis.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.click();
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-medium">Campaign Ready</h2>
                <p className="text-sm text-neutral-500 mt-1">{product_analysis.name}</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-2 py-1 text-xs bg-neutral-800 rounded">{product_analysis.category}</span>
                <span className="px-2 py-1 text-xs bg-neutral-800 rounded">{product_analysis.mood}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="card p-4">
                    <p className="text-xs text-neutral-500 mb-2">Original</p>
                    <img
                        src={`data:image/png;base64,${original_image}`}
                        alt="Original"
                        className="w-full h-48 object-contain rounded bg-neutral-900"
                    />
                </div>
                <div className="card p-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-neutral-500">AI Generated</p>
                        {styled_image && (
                            <button onClick={download} className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1">
                                <Download size={12} /> Download
                            </button>
                        )}
                    </div>
                    {styled_image ? (
                        <img
                            src={`data:image/png;base64,${styled_image}`}
                            alt="Styled"
                            className="w-full h-48 object-contain rounded bg-neutral-900"
                        />
                    ) : (
                        <div className="w-full h-48 rounded bg-neutral-900 flex items-center justify-center text-neutral-600 text-sm">
                            Not available
                        </div>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <CopyCard label="Instagram" content={marketing_copy.instagram_caption} />
                <CopyCard label="Email Subject" content={marketing_copy.email_subject} />
                <CopyCard label="Ad Headline" content={marketing_copy.ad_headline} />
                <CopyCard label="Ad Body" content={marketing_copy.ad_body} />
            </div>

            <div className="card p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-neutral-500 uppercase tracking-wide">Hashtags</span>
                    <CopyBtn text={marketing_copy.hashtags.map(h => `#${h}`).join(' ')} />
                </div>
                <div className="flex flex-wrap gap-2">
                    {marketing_copy.hashtags.map((tag, i) => (
                        <span key={i} className="text-xs text-blue-400">#{tag}</span>
                    ))}
                </div>
            </div>

            <div className="text-center">
                <button onClick={onReset} className="btn-primary px-6 py-2 rounded-lg flex items-center gap-2 mx-auto">
                    <RefreshCw size={16} /> New Campaign
                </button>
            </div>
        </div>
    );
}
