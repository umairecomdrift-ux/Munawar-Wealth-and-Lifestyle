
import React, { useState, useCallback } from 'react';
import { AppStatus, Framework, GeneratedImage, GroundingSource } from './types';
import { generateFramework, generateImage } from './services/geminiService';
import InputForm from './components/InputForm';
import FrameworkDisplay from './components/FrameworkDisplay';
import VisualGallery from './components/VisualGallery';
import { Loader2, Info } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [framework, setFramework] = useState<Framework | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (topic: string, visualMode: boolean, imageSize: '1K' | '2K' | '4K') => {
    try {
      setError(null);
      setStatus(AppStatus.LOADING_FRAMEWORK);
      
      const { framework: fw, sources: src } = await generateFramework(topic, visualMode);
      setFramework(fw);
      setSources(src);
      
      if (visualMode && fw.visualPrompts && fw.visualPrompts.length > 0) {
        // Check for API key if using image generation
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          // @ts-ignore
          await window.aistudio.openSelectKey();
        }

        setStatus(AppStatus.LOADING_IMAGES);
        const generatedImages: GeneratedImage[] = [];
        for (const prompt of fw.visualPrompts) {
          try {
            const url = await generateImage(prompt, imageSize);
            generatedImages.push({
              id: Math.random().toString(36).substr(2, 9),
              url,
              prompt,
              size: imageSize
            });
          } catch (imgErr) {
            console.error("Image generation failed for prompt", prompt, imgErr);
            // If it fails due to "Requested entity was not found", reset key
            if (String(imgErr).includes("Requested entity was not found")) {
              // @ts-ignore
              await window.aistudio.openSelectKey();
            }
          }
        }
        setImages(generatedImages);
      } else {
        setImages([]);
      }

      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setFramework(null);
    setImages([]);
    setSources([]);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#0f172a]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 py-6 px-4 md:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Munawar</h1>
            <p className="text-slate-500 font-medium">Wealth, Wisdom & Lifestyle Architect</p>
          </div>
          {status !== AppStatus.IDLE && (
            <button 
              onClick={handleReset}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-wider"
            >
              Start New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {status === AppStatus.IDLE && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-slate-800">Framework Generator</h2>
              <p className="text-lg text-slate-600 leading-relaxed italic">
                "Wealth is what you don't see. It is the options not yet exercised, the freedom to choose your time, and the clarity to ignore the noise."
              </p>
            </div>
            <InputForm onGenerate={handleGenerate} isSubmitting={false} />
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-800 text-sm">
              <Info className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold">Munawar Note:</p>
                <p>Provide a topic related to wealth building, behavior, or lifestyle design. I will generate a timeless principle-driven framework for your consideration.</p>
              </div>
            </div>
          </div>
        )}

        {(status === AppStatus.LOADING_FRAMEWORK || status === AppStatus.LOADING_IMAGES) && (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
            <Loader2 className="w-12 h-12 text-slate-400 animate-spin" />
            <div className="text-center space-y-2">
              <p className="text-xl font-medium text-slate-700">
                {status === AppStatus.LOADING_FRAMEWORK ? "Architecting Framework..." : "Visualizing Conceptual Models..."}
              </p>
              <p className="text-slate-500">
                {status === AppStatus.LOADING_FRAMEWORK 
                  ? "Analyzing time horizons and distilling timeless principles."
                  : "Rendering abstract representations of systemic trade-offs."}
              </p>
            </div>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-2">Architectural Interruption</h3>
              <p>{error}</p>
            </div>
            <button 
              onClick={handleReset}
              className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {framework && (status === AppStatus.SUCCESS || status === AppStatus.LOADING_IMAGES) && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-1000">
            <FrameworkDisplay framework={framework} sources={sources} />
            
            {images.length > 0 && (
              <VisualGallery images={images} setImages={setImages} />
            )}
            
            <div className="pt-8 border-t border-slate-200 flex justify-center">
              <p className="text-slate-400 text-sm max-w-lg text-center leading-relaxed">
                Munawar does not provide financial advice. This framework is a conceptual tool for rational decision-making and should be validated against your personal circumstances.
              </p>
            </div>
          </div>
        )}
      </main>
      
      <footer className="py-12 border-t border-slate-200 text-center text-slate-400 text-xs tracking-widest uppercase">
        © Munawar Frameworks • Rationality over Impulse • Decades over Months
      </footer>
    </div>
  );
};

export default App;
