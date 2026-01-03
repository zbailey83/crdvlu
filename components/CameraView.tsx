import React, { useRef, useState } from 'react';
import { Camera, Upload, ImageIcon as ImageFile } from 'lucide-react';

interface CameraViewProps {
  onImageCapture: (imageBase64: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onImageCapture }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onImageCapture(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center flex-1 transition-all duration-300 ${dragActive ? 'scale-105' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="w-full clay-card flex flex-col items-center justify-center p-8 space-y-8 relative overflow-hidden flex-1">
        
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-[#ffd4c4]/30 clay-card flex items-center justify-center mx-auto mb-2">
            <Camera className="w-12 h-12 text-[#2d2d3a]" />
          </div>
          
          <h2 className="text-3xl font-bold text-[#2d2d3a]">Ready to Scan?</h2>
          <p className="text-[#6b6b80] max-w-[240px] mx-auto text-sm font-medium">
            Place your card on a flat surface and take a clear picture.
          </p>
        </div>

        <div className="flex flex-col w-full gap-4 pt-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="clay-button bg-[#d4b3ff] py-5 px-8 text-white text-lg font-bold flex items-center justify-center gap-3 w-full"
          >
            <Camera className="w-6 h-6" />
            Take Photo
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="clay-button bg-white py-4 px-8 text-[#6b6b80] text-md font-bold flex items-center justify-center gap-3 w-full border border-gray-100"
          >
            <Upload className="w-5 h-5" />
            Upload File
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#b8b8c7] uppercase tracking-widest pt-4">
          <ImageFile className="w-4 h-4" />
          Supports All Card Types
        </div>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};