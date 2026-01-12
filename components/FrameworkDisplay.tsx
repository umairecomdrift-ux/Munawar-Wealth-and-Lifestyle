
import React from 'react';
import { Framework, GroundingSource } from '../types';
import { ShieldCheck, BrainCircuit, ExternalLink, ArrowRight, Layers, Target, Scale } from 'lucide-react';

interface FrameworkDisplayProps {
  framework: Framework;
  sources: GroundingSource[];
}

const FrameworkDisplay: React.FC<FrameworkDisplayProps> = ({ framework, sources }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar: Summary & Perspective */}
      <div className="lg:col-span-1 space-y-8">
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Strategic Summary
          </h3>
          <p className="text-xl serif italic text-slate-800 mb-4">{framework.topicSummary}</p>
          <p className="text-slate-600 leading-relaxed text-sm">{framework.topicContext}</p>
        </section>

        <section className="bg-slate-900 text-slate-100 p-8 rounded-3xl shadow-xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
            Long-Term Horizon
          </h3>
          <p className="text-lg font-light leading-relaxed mb-6">
            {framework.longTermPerspective}
          </p>
          <div className="h-px bg-slate-700 w-full mb-6"></div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            ARCHITECTED BY MUNAWAR
          </p>
        </section>

        {sources.length > 0 && (
          <section className="px-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              Contextual References
            </h3>
            <div className="space-y-2">
              {sources.map((source, i) => (
                <a 
                  key={i} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group p-2 rounded-lg hover:bg-slate-200/50 transition-colors"
                >
                  <span className="text-xs text-slate-600 font-medium truncate pr-4">{source.title}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-900" />
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Main Content: Frameworks, Models, Rules */}
      <div className="lg:col-span-2 space-y-8">
        {/* Core Frameworks */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
            <Layers className="w-6 h-6 text-slate-400" />
            Core Wisdom Frameworks
          </h2>
          <div className="grid gap-4">
            {framework.coreFrameworks.map((fw, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-300 transition-colors group">
                <h4 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-slate-900">{fw.name}</h4>
                <ul className="space-y-2 mb-4">
                  {fw.points.map((p, pi) => (
                    <li key={pi} className="flex gap-2 text-sm text-slate-600">
                      <ArrowRight className="w-4 h-4 shrink-0 text-slate-300 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="bg-slate-50 px-4 py-2 rounded-lg text-xs font-medium text-slate-500 font-mono">
                  {fw.logic}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mental Models & Decision Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900">
              <BrainCircuit className="w-5 h-5 text-slate-400" />
              Mental Models
            </h3>
            <div className="space-y-4">
              {framework.mentalModels.map((m, mi) => (
                <div key={mi} className="border-l-2 border-slate-200 pl-4 py-1">
                  <h4 className="font-bold text-slate-800">{m.name}</h4>
                  <p className="text-sm text-slate-600 mt-1">{m.application}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900">
              <Target className="w-5 h-5 text-slate-400" />
              Decision Rules
            </h3>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              {framework.decisionRules.map((r, ri) => (
                <div key={ri} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0 mt-0.5">
                    {ri + 1}
                  </div>
                  <p className="text-sm font-medium text-slate-700">{r}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trade Offs */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900">
            <Scale className="w-5 h-5 text-slate-400" />
            Lifestyle Trade-Offs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {framework.lifestyleTradeOffs.map((to, ti) => (
              <div key={ti} className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
                <h4 className="text-stone-900 font-bold mb-2 uppercase tracking-tight text-xs">{to.tradeOff}</h4>
                <p className="text-stone-600 text-sm italic leading-relaxed">"{to.reality}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameworkDisplay;
