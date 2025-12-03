import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult } from '../types';
import { ArrowLeft, ExternalLink, RefreshCw, DollarSign, Search } from 'lucide-react';

interface AnalysisViewProps {
  image: string;
  result: AnalysisResult | null;
  loading: boolean;
  onReset: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ image, result, loading, onReset }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-900">
      {/* Header Image Area */}
      <div className="relative h-1/3 min-h-[250px] w-full bg-black shrink-0">
        <img 
          src={image} 
          alt="Captured Card" 
          className="w-full h-full object-contain opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        <button 
          onClick={onReset}
          className="absolute top-4 left-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors z-20"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
            <div className="w-full max-w-[200px] h-1 relative overflow-hidden bg-slate-700 rounded-full mb-4">
               <div className="absolute top-0 left-0 h-full w-1/2 bg-blue-500 animate-[shimmer_1s_infinite_linear]" style={{animationName: 'scan'}}></div>
            </div>
            <div className="scanner-line absolute top-1/2 w-full opacity-50"></div>
            <p className="text-blue-400 font-semibold animate-pulse">Analyzing Market Data...</p>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-900 no-scrollbar">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            <div className="h-32 bg-slate-800 rounded w-full mt-6"></div>
          </div>
        ) : result ? (
          <div className="space-y-6 pb-20">
            {/* Main Result Card */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-xl">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                   <DollarSign className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Estimated Value</h3>
                   <div className="text-white text-lg font-medium prose prose-invert prose-p:my-0 prose-headings:my-1 max-w-none">
                     {/* We rely on the markdown to render the value nicely, but we can wrap it */}
                     <ReactMarkdown 
                        components={{
                            p: ({node, ...props}) => <span {...props} />, // Flatten paragraphs for this preview section if needed, or keep standard
                            strong: ({node, ...props}) => <span className="text-green-300 font-bold" {...props} />
                        }}
                     >
                      {/* Extract just the value line if possible, or show full text. 
                          For this demo, we show the full markdown below, but here we could be clever.
                          Let's just show a badge 'Market Analysis Complete' */}
                      Market Analysis Complete
                     </ReactMarkdown>
                   </div>
                </div>
              </div>
            </div>

            {/* Detailed Markdown Output */}
            <div className="prose prose-invert prose-blue max-w-none">
              <ReactMarkdown>{result.text}</ReactMarkdown>
            </div>

            {/* Sources / Grounding */}
            {result.groundingChunks && result.groundingChunks.length > 0 && (
              <div className="mt-8 border-t border-slate-800 pt-6">
                <h4 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-4">
                  <Search className="w-4 h-4" />
                  Price Sources & References
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
                        className="flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700/50 group"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <p className="text-sm font-medium text-blue-300 truncate group-hover:text-blue-200">
                            {chunk.web.title || "Market Source"}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{new URL(chunk.web.uri).hostname}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
            
             <div className="text-xs text-slate-600 mt-8 text-center px-4">
              *Estimates are based on available online data. Actual value may vary based on condition (centering, corners, edges, surface).
            </div>
          </div>
        ) : (
           <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <p>Something went wrong.</p>
              <button onClick={onReset} className="mt-4 text-blue-400 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Try Again
              </button>
           </div>
        )}
      </div>
    </div>
  );
};
