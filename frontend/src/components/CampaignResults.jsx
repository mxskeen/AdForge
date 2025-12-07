import { Download, Copy, Check, RefreshCw, Sparkles, X, Save, Edit2, Wand2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function CopyBtn({ text }) {
    const [copied, setCopied] = useState(false);
    const copy = async (e) => {
        e.stopPropagation();
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

function CopyCard({ label, content, delay, onClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            onClick={onClick}
            className="card p-6 hover:bg-neutral-800/50 transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
        >
            <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                    {label} <Wand2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
                </span>
                <CopyBtn text={content} />
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed line-clamp-3 group-hover:text-white transition-colors">
                {content}
            </p>
        </motion.div>
    );
}

export function CampaignResults({ data, onReset }) {
    const { product_analysis, styled_image, original_image } = data;
    const [copyData, setCopyData] = useState(data.marketing_copy);
    const [editing, setEditing] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [refining, setRefining] = useState(false);

    useEffect(() => {
        setCopyData(data.marketing_copy);
    }, [data]);

    const handleRefine = async () => {
        if (!prompt.trim()) return;
        setRefining(true);
        try {
            const res = await fetch('/api/refine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_text: editing.value,
                    refinement_prompt: prompt,
                    context: editing.key
                }),
            });
            const data = await res.json();
            setEditing(prev => ({ ...prev, value: data.refined_text }));
            setPrompt("");
        } catch (err) {
            console.error(err);
        } finally {
            setRefining(false);
        }
    };

    const handleSave = () => {
        setCopyData(prev => ({
            ...prev,
            [editing.key]: editing.value
        }));
        setEditing(null);
        setPrompt("");
    };

    const download = () => {
        if (!styled_image) return;
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${styled_image}`;
        link.download = `adforge-${product_analysis.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.click();
    };

    return (
        <>
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
                    <CopyCard
                        label="Instagram Caption"
                        content={copyData.instagram_caption}
                        delay={0.6}
                        onClick={() => setEditing({ key: 'instagram_caption', label: 'Instagram Caption', value: copyData.instagram_caption })}
                    />
                    <CopyCard
                        label="Email Subject"
                        content={copyData.email_subject}
                        delay={0.7}
                        onClick={() => setEditing({ key: 'email_subject', label: 'Email Subject', value: copyData.email_subject })}
                    />
                    <CopyCard
                        label="Ad Headline"
                        content={copyData.ad_headline}
                        delay={0.8}
                        onClick={() => setEditing({ key: 'ad_headline', label: 'Ad Headline', value: copyData.ad_headline })}
                    />
                    <CopyCard
                        label="Ad Body"
                        content={copyData.ad_body}
                        delay={0.9}
                        onClick={() => setEditing({ key: 'ad_body', label: 'Ad Body', value: copyData.ad_body })}
                    />
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
                        <CopyBtn text={copyData.hashtags.map(h => `#${h}`).join(' ')} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {copyData.hashtags.map((tag, i) => (
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

            {/* Edit Modal */}
            <AnimatePresence>
                {editing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setEditing(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-neutral-900 rounded-2xl w-full max-w-lg border border-neutral-800 overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    <Wand2 size={16} className="text-purple-400" />
                                    Refine {editing.label}
                                </h3>
                                <button onClick={() => setEditing(null)} className="p-1 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-neutral-300 text-sm leading-relaxed max-h-48 overflow-y-auto">
                                    {editing.value}
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                                        placeholder="Ask AI to refine (e.g., 'make it funnier', 'shorter')"
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 pr-12"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleRefine}
                                        disabled={!prompt.trim() || refining}
                                        className="absolute right-2 top-2 p-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {refining ? <RefreshCw size={16} className="animate-spin" /> : <Wand2 size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end gap-3">
                                <button
                                    onClick={() => setEditing(null)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-neutral-200 transition-colors flex items-center gap-2"
                                >
                                    <Save size={16} />
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
