import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const examples = [
    {
        title: "Minimalist Coffee",
        category: "Luxury",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop",
        caption: "Awaken your senses. #MorningRitual"
    },
    {
        title: "Urban Sneakers",
        category: "Streetwear",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
        caption: "Step into the future. #StreetStyle"
    },
    {
        title: "Organic Skincare",
        category: "Beauty",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop",
        caption: "Pure nature, pure you. #CleanBeauty"
    },
    {
        title: "Tech Gadgets",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop",
        caption: "Work smarter, not harder. #TechLife"
    },
    {
        title: "Modern Furniture",
        category: "Home",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop",
        caption: "Elevate your space. #InteriorDesign"
    }
];

export function Carousel() {
    const [selected, setSelected] = useState(null);

    return (
        <>
            <div className="w-full overflow-hidden py-12 bg-neutral-950/50">
                <div className="text-center mb-8">
                    <h3 className="text-lg font-medium text-neutral-200">Made with AdForge</h3>
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
