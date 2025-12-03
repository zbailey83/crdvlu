import React, { useState } from 'react';
import { CameraView } from './components/CameraView';
import { AnalysisView } from './components/AnalysisView';
import { analyzeCardValue } from './services/geminiService';
import { AppState, AnalysisResult } from './types';
import { Sparkles, ScanLine } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      {/* Mobile-first Layout Container */}
      <div className="mx-auto max-w-md h-screen flex flex-col bg-slate-950 shadow-2xl relative overflow-hidden">
        
        {/* Header - Only show on IDLE for a clean landing, or transparent on others */}
        {appState === AppState.IDLE && (
          <header className="p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ScanLine className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                CardValue AI
              </h1>
            </div>
            <div className="px-3 py-1 bg-blue-900/30 border border-blue-800/50 rounded-full text-xs font-medium text-blue-300 flex items-center gap-1">
               <Sparkles className="w-3 h-3" />
               Beta
            </div>
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1 relative">
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
        
        {/* Background Gradients for Aesthetics */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-20%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]"></div>
        </div>

      </div>
    </div>
  );
}
