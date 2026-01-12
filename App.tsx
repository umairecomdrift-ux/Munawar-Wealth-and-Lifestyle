
import React, { useState, useEffect } from 'react';
import { AppStatus, Framework, GroundingSource } from './types';
import { generateFramework } from './services/geminiService';
import InputForm from './components/InputForm';
import FrameworkDisplay from './components/FrameworkDisplay';
import { Loader2, Info, FileDown, RefreshCw, Key, AlertCircle } from 'lucide-react';

// Augmented Window interface to match the existing AIStudio type in the environment.
// Using 'readonly' to match the modifiers and 'AIStudio' type as required by the compiler.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    readonly aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [framework, setFramework] = useState<Framework | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<{ message: string; isQuota: boolean } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasPersonalKey, setHasPersonalKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasPersonalKey(hasKey);
      }
    };
    checkKey();
  }, []);

  const handleGenerate = async (topic: string) => {
    try {
      setError(null);
      setStatus(AppStatus.LOADING_FRAMEWORK);
      
      const { framework: fw, sources: src } = await generateFramework(topic);
      setFramework(fw);
      setSources(src);
      
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error("Architectural Error:", err);
      
      // If the request fails with "Requested entity was not found.", 
      // reset the key selection state and prompt the user to select a key again via openSelectKey().
      if (err.message?.includes("Requested entity was not found.")) {
        setHasPersonalKey(false);
        handleOpenKeySelector();
        return;
      }
      
      let message = "An unexpected architectural error occurred.";
      let isQuota = false;

      // Detect 429 Resource Exhausted or quota errors
      const errStr = JSON.stringify(err);
      if (errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED") || err.message?.includes("quota")) {
        message = "The Architectural Studio is currently at capacity (Rate Limit Hit). Please wait a few moments or provide a personal API key for priority access.";
        isQuota = true;
      } else {
        message = err.message || message;
      }

      setError({ message, isQuota });
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setFramework(null);
    setSources([]);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success as per race condition rules to proceed to the app
      setHasPersonalKey(true);
      setError(null);
      setStatus(AppStatus.IDLE);
    }
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

    // @ts-ignore - html2pdf is expected to be available globally
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
                  {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.