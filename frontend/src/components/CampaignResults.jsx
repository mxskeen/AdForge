import { Download, Copy, Check, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

function CopyBtn({ text }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={copy}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Copy to clipboard"
        >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-neutral-500" />}
        </button>
    );
}

function CopyCard({ label, content, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="card p-6 hover:bg-neutral-800/50 transition-colors group"
        >
            <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{label}</span>
                <CopyBtn text={content} />
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed group-hover:text-white transition-colors">
                {content}
            </p>
        </motion.div>
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
        <div className="space-y-12 w-full max-w-4xl mx-auto">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                    <Sparkles size={12} />
                    <span>Campaign Ready</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
                    {product_analysis.name}
                </h2>
                <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 text-xs font-medium bg-neutral-800 rounded-full text-neutral-400 border border-neutral-700">
                        {product_analysis.category}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium bg-neutral-800 rounded-full text-neutral-400 border border-neutral-700">
                        {product_analysis.mood}
                    </span>
                </div>
            </motion.div>

            {/* Hero Image Section */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Original */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative card p-4 bg-black">
                        <div className="absolute top-4 left-4 px-2 py-1 bg-black/60 backdrop-blur rounded text-xs font-medium text-white/70">Original</div>
                        <img
                            src={`data:image/png;base64,${original_image}`}
                            alt="Original"
                            className="w-full h-64 object-contain rounded-lg"
                        />
                    </div>
                </motion.div>

                {/* Generated */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 animate-pulse"></div>
                    <div className="relative card p-1 bg-neutral-900 border-0 overflow-hidden">
                        <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-black/60 backdrop-blur rounded text-xs font-medium text-blue-300 border border-blue-500/30 flex items-center gap-1">
                            <Sparkles size={10} /> AI Generated
                        </div>
                        {styled_image ? (
                            <div className="relative overflow-hidden rounded-xl">
                                <img
                                    src={`data:image/png;base64,${styled_image}`}
                                    alt="Styled"
                                    className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                    <button
                                        onClick={download}
                                        className="px-6 py-2 bg-white text-black rounded-full font-medium text-sm hover:scale-105 transition-transform flex items-center gap-2"
                                    >
                                        <Download size={14} /> Download High-Res
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-80 flex items-center justify-center text-neutral-600">
                                Generation failed
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Copy Grid */}
            <div className="grid md:grid-cols-2 gap-4">
                <CopyCard label="Instagram Caption" content={marketing_copy.instagram_caption} delay={0.6} />
                <CopyCard label="Email Subject" content={marketing_copy.email_subject} delay={0.7} />
                <CopyCard label="Ad Headline" content={marketing_copy.ad_headline} delay={0.8} />
                <CopyCard label="Ad Body" content={marketing_copy.ad_body} delay={0.9} />
            </div>

            {/* Hashtags */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="card p-6"
            >
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Hashtags</span>
                    <CopyBtn text={marketing_copy.hashtags.map(h => `#${h}`).join(' ')} />
                </div>
                <div className="flex flex-wrap gap-2">
                    {marketing_copy.hashtags.map((tag, i) => (
                        <span key={i} className="px-3 py-1.5 bg-neutral-800 rounded-lg text-sm text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors cursor-default">
                            #{tag}
                        </span>
                    ))}
                </div>
            </motion.div>

            {/* Action Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex justify-center pt-8"
            >
                <button
                    onClick={onReset}
                    className="group flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-full text-neutral-400 hover:text-white transition-all"
                >
                    <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>Create Another Campaign</span>
                </button>
            </motion.div>
        </div>
    );
}
