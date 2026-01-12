
import React, { useState } from 'react';
import { Send, Zap } from 'lucide-react';

interface InputFormProps {
  onGenerate: (topic: string) => void;
  isSubmitting: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isSubmitting }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isSubmitting) {
      onGenerate(topic);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative group">
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Define the problem or asset class... (e.g., 'Navigating Bitcoin Volatility', 'Early Retirement for Software Engineers'...)"
          className="w-full bg-white border-2 border-blue-50 rounded-[2.5rem] p-10 pr-24 text-xl font-medium text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-400 transition-all shadow-2xl shadow-blue-500/5 group-hover:shadow-blue-500/10 resize-none min-h-[200px]"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !topic.trim()}
          className="absolute bottom-10 right-10 p-5 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 disabled:bg-slate-200 transition-all shadow-xl shadow-blue-200 disabled:shadow-none hover:scale-105 active:scale-95"
        >
          <Send className="w-7 h-7" />
        </button>
      </div>
      
      <div className="flex justify-center">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
          <Zap className="w-3 h-3" />
          Powered by Deep Reasoning
        </div>
      </div>
    </form>
  );
};

export default InputForm;
