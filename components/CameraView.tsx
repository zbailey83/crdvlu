import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Upload } from 'lucide-react';

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
      className={`flex flex-col items-center justify-center h-full p-6 transition-colors ${dragActive ? 'bg-slate-800' : 'bg-transparent'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="relative w-full max-w-md aspect-[3/4] border-2 border-dashed border-slate-600 rounded-2xl flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm overflow-hidden group">
        
        {/* Animated Scanner Effect Hint */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="w-full h-full bg-[linear-gradient(transparent,rgba(59,130,246,0.1),transparent)] translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-[2s] ease-in-out"></div>
        </div>

        <div className="text-center space-y-6 z-10 p-6">
          <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
            <Camera className="w-10 h-10 text-blue-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-white">Scan a Card</h2>
          <p className="text-slate-400 max-w-xs mx-auto">
            Take a clear photo of your sports card to instantly get details and market value estimates.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mt-8">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 py-4 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/50"
            >
              <Camera className="w-5 h-5" />
              <span>Camera</span>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 py-4 px-4 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white rounded-xl font-semibold transition-all"
            >
              <Upload className="w-5 h-5" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Hidden Input */}
        <input
          type="file"
          accept="image/*"
          capture="environment" // Mobile-friendly: prompts camera
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
        <ImageIcon className="w-4 h-4" />
        <span>Supports JPG, PNG, WEBP</span>
      </div>
    </div>
  );
};
