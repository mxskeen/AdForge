
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const examples = [
    {
        title: "Monster Energy",
        category: "Beverage",
        image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=1000&auto=format&fit=crop",
        caption: "Literally the best thing on this planet #EnergyDrink"
    },
    {
        title: "EcoChronos Watch",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000&auto=format&fit=crop",
        caption: "Time for nature. Sustainably crafted. 🌿 #EcoLuxury"
    },
    {
        title: "Elixir",
        category: "Fragrance",
        image: "https://images.unsplash.com/photo-1616640045164-deb3b104c4b6?w=500&auto=format&fit=crop",
        caption: "The scent of mystery. Own the night. 🌙 #MidnightElixir"
    },
    {
        title: "RetroSnap 90",
        category: "Photography",
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop",
        caption: "Capture the vibe. Vintage soul, modern tech. 📸 #RetroStyle"
    },
    {
        title: "X1",
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop",
        caption: "Walk on the future. Zero gravity comfort. 🚀 #CyberStep"
    },
    {
        title: "Zenith Headphones",
        category: "Audio",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
        caption: "Silence the world. Hear the music. 🎧 #PureSound"
    }
];

export function Carousel() {
    const [selected, setSelected] = useState(null);

    return (
        <>
            <div className="w-full overflow-hidden py-12 bg-neutral-950/50">
                <div className="text-center mb-8">
                    <h3 className="text-lg font-medium text-neutral-200">AdForge Can Help You Think Beyond</h3>
                </div>

                <div className="relative flex overflow-x-hidden group">
                    <div className="flex gap-6 animate-scroll whitespace-nowrap px-4">
                        {[...examples, ...examples, ...examples].map((item, i) => (
                            <div
                                key={i}
                                onClick={() => setSelected(item)}
                                className="inline-block w-[300px] card overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-5 whitespace-normal">
                                    <span className="text-xs font-medium text-blue-400 uppercase tracking-wider block mb-2">
                                        {item.category}
                                    </span>
                                    <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-neutral-900 rounded-2xl overflow-hidden max-w-2xl w-full border border-neutral-800 relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelected(null)}
                                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            <div className="grid md:grid-cols-2">
                                <div className="h-64 md:h-auto">
                                    <img
                                        src={selected.image}
                                        alt={selected.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-8 flex flex-col justify-center">
                                    <span className="text-xs font-medium text-blue-400 uppercase tracking-wider mb-2">
                                        {selected.category}
                                    </span>
                                    <h3 className="text-2xl font-bold mb-4">{selected.title}</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-neutral-800/50 rounded-xl">
                                            <p className="text-sm text-neutral-300 font-medium mb-1">Instagram Caption</p>
                                            <p className="text-sm text-neutral-400">{selected.caption}</p>
                                        </div>
                                        <div className="p-4 bg-neutral-800/50 rounded-xl">
                                            <p className="text-sm text-neutral-300 font-medium mb-1">Generated Style</p>
                                            <p className="text-sm text-neutral-400">Professional studio lighting, 4k, minimalist composition</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
