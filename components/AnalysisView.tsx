import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult } from '../types';
import { ArrowLeft, ExternalLink, RefreshCw, BadgeDollarSign, Info } from 'lucide-react';

interface AnalysisViewProps {
  image: string;
  result: AnalysisResult | null;
  loading: boolean;
  onReset: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ image, result, loading, onReset }) => {
  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Captured Image Preview - Soft Inset Look */}
      <div className="relative h-1/3 min-h-[220px] w-full clay-card overflow-hidden shrink-0 border-4 border-white shadow-inner">
        <img 
          src={image} 
          alt="Captured Card" 
          className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-40 grayscale' : 'opacity-100'}`}
        />
        
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20 backdrop-blur-sm">
            <div className="w-16 h-16 bg-white clay-card flex items-center justify-center animate-spin-slow">
              <RefreshCw className="w-8 h-8 text-[#d4b3ff] animate-spin" />
            </div>
            <p className="mt-4 text-[#2d2d3a] font-bold text-lg animate-pulse">Calculating Value...</p>
          </div>
        )}

        <button 
          onClick={onReset}
          className="absolute top-4 left-4 p-3 bg-white clay-button text-[#2d2d3a] z-20"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-12">
        {loading ? (
          <div className="space-y-6">
            <div className="clay-card p-6 h-32 animate-pulse bg-white/50 border-white"></div>
            <div className="clay-card p-6 h-64 animate-pulse bg-white/30 border-white"></div>
          </div>
        ) : result ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Value Badge Card */}
            <div className="bg-[#fef9f5] clay-card p-6 border-2 border-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#ffd4c4] clay-card flex items-center justify-center shrink-0">
                   <BadgeDollarSign className="w-8 h-8 text-white" />
                </div>
                <div>
                   <h3 className="text-[#6b6b80] text-xs font-bold uppercase tracking-wider">Est. Market Value</h3>
                   <div className="text-[#2d2d3a] text-xl font-extrabold leading-tight">
                      Price Analysis Ready
                   </div>
                </div>
              </div>
            </div>

            {/* Analysis Text Card */}
            <div className="clay-card bg-white p-8">
              <div className="prose prose-slate max-w-none text-[#2d2d3a] font-medium leading-relaxed
                prose-headings:font-bold prose-headings:text-[#2d2d3a] 
                prose-p:text-[#6b6b80] prose-strong:text-[#2d2d3a] prose-strong:font-bold">
                <ReactMarkdown>{result.text}</ReactMarkdown>
              </div>
            </div>

            {/* Sources */}
            {result.groundingChunks && result.groundingChunks.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-[#6b6b80] px-4 flex items-center gap-2 uppercase tracking-widest">
                  <Info className="w-4 h-4" />
                  Market Data Sources
                </h4>
                <div className="grid gap-3">
                  {result.groundingChunks.map((chunk, idx) => {
                    if (!chunk.web?.uri) return null;
                    return (
                      <a
                        key={idx}
                        href={chunk.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="clay-card bg-white/80 p-4 flex items-center justify-between hover:bg-white transition-all group border border-transparent hover:border-white"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-sm font-bold text-[#2d2d3a] truncate">
                            {chunk.web.title || "Market Result"}
                          </p>
                          <p className="text-[10px] text-[#b8b8c7] font-bold uppercase tracking-tighter mt-0.5">
                            {new URL(chunk.web.uri).hostname}
                          </p>
                        </div>
                        <div className="w-8 h-8 clay-card bg-[#d4b3ff]/20 flex items-center justify-center shrink-0">
                          <ExternalLink className="w-4 h-4 text-[#d4b3ff]" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
            
             <p className="text-[10px] font-bold text-[#b8b8c7] text-center px-10 uppercase leading-normal pt-4">
              AI-generated estimates are for informational use only. Market prices fluctuate daily.
            </p>
          </div>
        ) : (
           <div className="clay-card bg-white p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 clay-card flex items-center justify-center">
                 <RefreshCw className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-[#2d2d3a]">Analysis Failed</h3>
              <p className="text-[#6b6b80] text-sm font-medium">We couldn't reach the market database. Please try a different photo.</p>
              <button onClick={onReset} className="clay-button bg-[#d4b3ff] text-white py-3 px-8 font-bold mt-4">
                  Retry Scan
              </button>
           </div>
        )}
      </div>
    </div>
  );
};