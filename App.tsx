
import React, { useState } from 'react';
import { AppStatus, Framework, GroundingSource } from './types';
import { generateFramework } from './services/geminiService';
import InputForm from './components/InputForm';
import FrameworkDisplay from './components/FrameworkDisplay';
import { Loader2, Info, FileDown, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [framework, setFramework] = useState<Framework | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerate = async (topic: string) => {
    try {
      setError(null);
      setStatus(AppStatus.LOADING_FRAMEWORK);
      
      const { framework: fw, sources: src } = await generateFramework(topic);
      setFramework(fw);
      setSources(src);
      
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected architectural error occurred.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setFramework(null);
    setSources([]);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  const downloadPDF = () => {
    const element = document.getElementById('framework-to-print');
    if (!element) return;
    
    setIsDownloading(true);
    const opt = {
      margin: 10,
      filename: `Munawar-Framework-${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 3, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save().then(() => {
      setIsDownloading(false);
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#0f172a] selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 py-4 px-4 md:px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={handleReset}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">M</div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter text-blue-900">MUNAWAR</h1>
              <p className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] -mt-1">Architect</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {framework && status === AppStatus.SUCCESS && (
              <>
                <button 
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 disabled:opacity-50"
                >
                  {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
                  EXPORT PDF
                </button>
                <button 
                  onClick={handleReset}
                  className="p-2.5 bg-white border border-blue-100 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors"
                  title="New Analysis"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {status === AppStatus.IDLE && (
          <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-1000">
            <div className="text-center space-y-6">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Framework <br/><span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Architect.</span></h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
                Clean reasoning for wealth, life, and the long horizon.
              </p>
            </div>
            
            <InputForm onGenerate={handleGenerate} isSubmitting={false} />
            
            <div className="bg-white border border-blue-100 p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/5 flex gap-6">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-900 text-sm uppercase tracking-widest">Philosophy</p>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  We don't solve for months; we solve for decades. Every output is a logical blueprint designed to withstand market cycles and human emotion.
                </p>
              </div>
            </div>
          </div>
        )}

        {status === AppStatus.LOADING_FRAMEWORK && (
          <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative">
              <div className="w-24 h-24 border-2 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse shadow-2xl shadow-blue-600"></div>
              </div>
            </div>
            <div className="text-center space-y-3">
              <p className="text-2xl font-black text-slate-900 tracking-tighter">ARCHITECTING BLUEPRINT</p>
              <p className="text-blue-500 font-bold text-xs uppercase tracking-[0.4em]">Decoupling Noise from Truth</p>
            </div>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="max-w-2xl mx-auto text-center animate-in slide-in-from-top-4">
            <div className="bg-red-50 border border-red-100 text-red-900 p-10 rounded-[3rem] shadow-2xl shadow-red-100">
              <h3 className="text-2xl font-black mb-4 tracking-tight">System Interruption</h3>
              <p className="text-red-700 font-medium mb-8 leading-relaxed">{error}</p>
              <button 
                onClick={handleReset}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
              >
                RESTART SESSION
              </button>
            </div>
          </div>
        )}

        {framework && status === AppStatus.SUCCESS && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div id="framework-to-print">
              <FrameworkDisplay framework={framework} sources={sources} />
            </div>
            
            <div className="mt-20 pt-12 border-t border-blue-50 flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-100"></div>
                <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                <div className="w-2 h-2 rounded-full bg-blue-100"></div>
              </div>
              <p className="text-blue-400 text-[9px] font-black uppercase tracking-[0.5em] text-center">
                STRATEGIC DOCUMENT • CONFIDENTIAL & RATIONAL
              </p>
            </div>
          </div>
        )}
      </main>
      
      <footer className="py-12 text-center text-slate-300 text-[10px] font-bold tracking-[0.4em] uppercase">
        © Munawar Systems • Decades over Months
      </footer>
    </div>
  );
};

export default App;
