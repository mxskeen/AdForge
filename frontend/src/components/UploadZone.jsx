import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';

export function UploadZone({ onImageSelect, disabled }) {
    const [preview, setPreview] = useState(null);

    const handleFile = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
            onImageSelect(e.target.result.split(',')[1]);
        };
        reader.readAsDataURL(file);
    }, [onImageSelect]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
    }, [handleFile]);

    const clear = () => {
        setPreview(null);
        onImageSelect(null);
    };

    if (preview) {
        return (
            <div className="card p-4 relative">
                <button
                    onClick={clear}
                    disabled={disabled}
                    className="absolute top-2 right-2 p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-full"
                >
                    <X size={14} />
                </button>
                <img src={preview} alt="Preview" className="w-full max-h-64 object-contain rounded" />
            </div>
        );
    }

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="upload-zone rounded-lg p-12 text-center"
        >
            <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files[0])}
                className="hidden"
                id="upload"
                disabled={disabled}
            />
            <label htmlFor="upload" className="cursor-pointer block">
                <div className="flex flex-col items-center gap-3">
                    <Upload size={24} className="text-neutral-500" />
                    <p className="text-sm text-neutral-400">Drop image or click to upload</p>
                </div>
            </label>
        </div>
    );
}
