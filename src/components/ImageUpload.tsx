import { useRef, useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface Props {
  currentPhotoUrl?: string;
  onPhotoChange: (dataUrl: string | undefined) => void;
  className?: string;
}

export default function ImageUpload({ currentPhotoUrl, onPhotoChange, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onPhotoChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div className={className}>
      {currentPhotoUrl ? (
        <div className="relative">
          <img
            src={currentPhotoUrl}
            alt="Tank photo"
            className="w-full h-40 object-cover rounded-xl"
          />
          <button
            type="button"
            onClick={() => onPhotoChange(undefined)}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white text-xs px-2 py-1 rounded-lg transition-colors"
          >
            Change
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={clsx(
            'w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors',
            dragOver
              ? 'border-ocean-400 bg-ocean-50'
              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          )}
        >
          <PhotoIcon className="w-7 h-7 text-slate-300" />
          <p className="text-sm text-slate-400">Click or drag to upload a tank photo</p>
          <p className="text-xs text-slate-300">JPG, PNG, WEBP supported</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
