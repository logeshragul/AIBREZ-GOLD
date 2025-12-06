import React, { useState, useRef } from 'react';
import { X, Wand2, Image as ImageIcon, Upload, Loader2, Download, Sparkles } from 'lucide-react';
import { generateJewelryDesign, analyzeJewelryImage } from '../services/geminiService';

interface AIStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIStudio: React.FC<AIStudioProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'GENERATE' | 'ANALYZE'>('GENERATE');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analyze State
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<{data: string, mimeType: string} | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setResultImage(null);
    try {
      const image = await generateJewelryDesign(prompt, aspectRatio);
      setResultImage(image);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        // Remove prefix for API
        const base64Data = base64String.split(',')[1];
        setRawFile({ data: base64Data, mimeType: file.type });
        setAnalysisText(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!rawFile) return;
    setIsLoading(true);
    try {
      const text = await analyzeJewelryImage(rawFile.data, rawFile.mimeType);
      setAnalysisText(text);
    } catch (error) {
      console.error(error);
      setAnalysisText("Failed to analyze image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
           <div className="flex items-center gap-2">
             <div className="bg-amber-100 p-2 rounded-lg">
               <Sparkles className="w-5 h-5 text-amber-600" />
             </div>
             <div>
               <h2 className="text-lg font-bold text-slate-800">AI Design Studio</h2>
               <p className="text-xs text-slate-500 font-medium">Powered by Gemini 3 Pro</p>
             </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
             <X className="w-5 h-5 text-slate-500" />
           </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setMode('GENERATE')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'GENERATE' ? 'text-amber-600 bg-amber-50 border-b-2 border-amber-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Wand2 className="w-4 h-4" />
            Generate Design
          </button>
          <button 
            onClick={() => setMode('ANALYZE')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'ANALYZE' ? 'text-amber-600 bg-amber-50 border-b-2 border-amber-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <ImageIcon className="w-4 h-4" />
            Analyze Image
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          
          {mode === 'GENERATE' && (
            <div className="space-y-6">
               <div className="space-y-3">
                 <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Description</label>
                 <textarea 
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder="E.g., A traditional Indian gold necklace with ruby stones and intricate peacock motifs..."
                   className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none resize-none text-sm"
                 />
               </div>
               
               <div className="space-y-3">
                 <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Aspect Ratio</label>
                 <div className="flex flex-wrap gap-2">
                   {['1:1', '3:4', '4:3', '9:16', '16:9'].map(ratio => (
                     <button
                       key={ratio}
                       onClick={() => setAspectRatio(ratio)}
                       className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${aspectRatio === ratio ? 'bg-amber-500 text-white border-amber-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                     >
                       {ratio}
                     </button>
                   ))}
                 </div>
               </div>

               <button 
                 onClick={handleGenerate}
                 disabled={isLoading || !prompt}
                 className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                 {isLoading ? 'Generating Design...' : 'Generate Design'}
               </button>

               {resultImage && (
                 <div className="mt-6 animate-in fade-in slide-in-from-bottom-4">
                   <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-200 group">
                     <img src={resultImage} alt="Generated Design" className="w-full h-auto" />
                     <a 
                       href={resultImage} 
                       download={`aibrez-design-${Date.now()}.png`}
                       className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-900 p-2 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                     >
                       <Download className="w-5 h-5" />
                     </a>
                   </div>
                 </div>
               )}
            </div>
          )}

          {mode === 'ANALYZE' && (
            <div className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 hover:border-amber-400 transition-all group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <div className="p-3 bg-slate-100 rounded-full group-hover:bg-amber-50 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-amber-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700">Click to upload image</p>
                  <p className="text-xs text-slate-400">JPG, PNG support</p>
                </div>
              </div>

              {previewImage && (
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                     <button 
                       onClick={handleAnalyze}
                       disabled={isLoading}
                       className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 self-start transition-colors disabled:opacity-50"
                     >
                       {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                       Analyze Now
                     </button>
                  </div>
                </div>
              )}

              {analysisText && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 animate-in fade-in">
                  <h4 className="text-xs font-bold uppercase text-amber-600 mb-2 flex items-center gap-1">
                    <Bot className="w-3 h-3" /> AI Analysis
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{analysisText}</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// Helper icon
const Bot: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M12 12v6"/><path d="M12 22h.01"/><path d="M8 12h.01"/><path d="M16 12h.01"/></svg>
);