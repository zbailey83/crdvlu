import React, { useState } from 'react';
import { CameraView } from './components/CameraView';
import { AnalysisView } from './components/AnalysisView';
import { analyzeCardValue } from './services/geminiService';
import { AppState, AnalysisResult } from './types';
import { Sparkles, CircleDashed } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleImageCapture = async (imageBase64: string) => {
    setCapturedImage(imageBase64);
    setAppState(AppState.ANALYZING);

    try {
      const result = await analyzeCardValue(imageBase64);
      setAnalysisResult(result);
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 sm:px-0">
      {/* Mobile-first Layout Container */}
      <div className="w-full max-w-md h-[90vh] flex flex-col relative">
        
        {/* Header - Soft Floating Header */}
        {appState === AppState.IDLE && (
          <header className="mb-8 flex flex-col items-center justify-center animate-float">
            <div className="w-16 h-16 bg-white clay-card flex items-center justify-center mb-4">
              <CircleDashed className="w-8 h-8 text-[#d4b3ff]" />
            </div>
            <h1 className="text-4xl font-extrabold text-[#2d2d3a] tracking-tight text-center">
              CardValue AI
            </h1>
            <p className="text-[#6b6b80] font-medium mt-1 flex items-center gap-1.5 bg-white/40 px-3 py-1 rounded-full text-xs">
               <Sparkles className="w-3 h-3 text-[#ffd4c4]" />
               Smart Market Estimator
            </p>
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1 relative flex flex-col h-full overflow-hidden">
          {appState === AppState.IDLE && (
             <CameraView onImageCapture={handleImageCapture} />
          )}

          {(appState === AppState.ANALYZING || appState === AppState.RESULT || appState === AppState.ERROR) && capturedImage && (
            <AnalysisView 
              image={capturedImage} 
              loading={appState === AppState.ANALYZING}
              result={analysisResult}
              onReset={resetApp}
            />
          )}
        </main>
      </div>
    </div>
  );
}