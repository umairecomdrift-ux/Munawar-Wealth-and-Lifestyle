
import React from 'react';
import { Framework, GroundingSource } from '../types';
import { ShieldCheck, BrainCircuit, ExternalLink, ArrowRight, Layers, Target, Scale, Zap } from 'lucide-react';

interface FrameworkDisplayProps {
  framework: Framework;
  sources: GroundingSource[];
}

const FrameworkDisplay: React.FC<FrameworkDisplayProps> = ({ framework, sources }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-16 wisdom-content selection:bg-blue-100">
      {/* Top Banner: Thesis */}
      <div className="bg-white border-2 border-blue-100 rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-blue-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
          <ShieldCheck className="w-12 h-12 text-blue-50 opacity-20" />
        </div>
        
        <div className="max-w-3xl space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-[0.2em]">
            Strategic Thesis
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            {framework.topicSummary}
          </h2>
          <p className="text-lg md:text-xl font-medium text-slate-500 leading-relaxed border-l-4 border-blue-100 pl-8 italic">
            {framework.topicContext}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Col: Core Logic (Blueprint Style) */}
        <div className="lg:col-span-8 space-y-12">
          <section className="space-y-8">
            <div className="flex items-center gap-4 px-2">
              <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Core Intellectual Frameworks</h3>
            </div>
            
            <div className="grid gap-8">
              {framework.coreFrameworks.map((fw, idx) => (
                <div key={idx} className="group bg-white p-10 rounded-[2.5rem] border border-blue-50 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                  <div className="flex justify-between items-start mb-10">
                    <h4 className="text-2xl font-black text-blue-900 tracking-tight group-hover:text-blue-600 transition-colors">
                      {fw.name}
                    </h4>
                    <span className="text-[10px] font-black text-blue-200 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-widest">Module_{idx + 1}</span>
                  </div>
                  
                  <div className="space-y-6 mb-12">
                    {fw.points.map((p, pi) => (
                      <div key={pi} className="flex gap-6 items-start">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 shrink-0 shadow-lg shadow-blue-200"></div>
                        <p className="text-slate-700 font-bold leading-relaxed tracking-tight">{p}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 tracking-widest uppercase shrink-0">Formula</div>
                    <code className="text-blue-600 font-bold text-sm tracking-tight font-mono">{fw.logic}</code>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trade Offs Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 px-2">
              <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Asymmetric Trade-Offs</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {framework.lifestyleTradeOffs.map((to, ti) => (
                <div key={ti} className="bg-white p-10 rounded-[2.5rem] border-2 border-blue-50 hover:bg-blue-600 group transition-all duration-500 shadow-xl shadow-blue-500/5">
                  <h5 className="text-blue-900 font-black mb-6 uppercase tracking-wider text-[11px] group-hover:text-blue-200">{to.tradeOff}</h5>
                  <p className="text-slate-600 text-lg font-bold leading-relaxed group-hover:text-white transition-colors">
                    "{to.reality}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Col: Decision Matrix & Rules */}
        <div className="lg:col-span-4 space-y-12">
          {/* Mental Models Sidebar */}
          <section className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl shadow-slate-900/20 space-y-10">
            <div className="space-y-2">
              <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Matrix</h3>
              <h4 className="text-2xl font-black tracking-tighter">Mental Models</h4>
            </div>
            
            <div className="space-y-8">
              {framework.mentalModels.map((m, mi) => (
                <div key={mi} className="space-y-3 group">
                  <div className="flex items-center gap-3">
                    <BrainCircuit className="w-4 h-4 text-blue-400" />
                    <h5 className="font-black text-sm tracking-widest uppercase group-hover:text-blue-400 transition-colors">{m.name}</h5>
                  </div>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed border-l border-slate-800 pl-4">{m.application}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Decision Rules */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 px-2">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">Rules of Engagement</h3>
            </div>
            
            <div className="space-y-4">
              {framework.decisionRules.map((r, ri) => (
                <div key={ri} className="bg-white p-6 rounded-2xl border border-blue-50 flex gap-4 items-center group hover:translate-x-1 transition-transform">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xs font-black group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                    {ri + 1}
                  </div>
                  <p className="text-sm font-bold text-slate-800">{r}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Grounding Source */}
          {sources.length > 0 && (
            <section className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100 space-y-6">
              <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">External Grounding</h3>
              <div className="space-y-3">
                {sources.map((s, si) => (
                  <a key={si} href={s.uri} target="_blank" rel="noopener" className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 hover:border-blue-400 transition-all group">
                    <span className="text-[10px] font-bold text-slate-500 truncate pr-4">{s.title}</span>
                    <ExternalLink className="w-3 h-3 text-blue-200 group-hover:text-blue-600" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Long Term Horizon */}
          <section className="bg-white border-2 border-blue-50 p-10 rounded-[3rem] relative overflow-hidden">
             <div className="flex flex-col gap-6">
               <div className="w-12 h-px bg-blue-600"></div>
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Decade Horizon</h4>
               <p className="text-sm font-bold text-slate-900 leading-relaxed italic">
                 {framework.longTermPerspective}
               </p>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FrameworkDisplay;
