
import React, { useState } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';

interface InputFormProps {
  onGenerate: (topic: string, visualMode: boolean, imageSize: '1K' | '2K' | '4K') => void;
  isSubmitting: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isSubmitting }) => {
  const [topic, setTopic] = useState('');
  const [visualMode, setVisualMode] = useState(false);
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isSubmitting) {
      onGenerate(topic, visualMode, imageSize);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative group">
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., 'Building wealth in your 30s', 'Avoiding emotional investing'...)"
          className="w-full bg-white border border-slate-200 rounded-2xl p-6 pr-14 text-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm group-hover:shadow-md resize-none min-h-[120px]"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !topic.trim()}
          className="absolute bottom-6 right-6 p-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 disabled:bg-slate-200 transition-all shadow-lg"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${visualMode ? 'bg-slate-900' : 'bg-slate-200'}`}>
              <input
                type="checkbox"
                className="hidden"
                checked={visualMode}
                onChange={(e) => setVisualMode(e.target.checked)}
              />
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${visualMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              Generate Visual Explanation
            </span>
          </label>
        </div>

        {visualMode && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Image Quality:</span>
            <div className="flex bg-slate-100 rounded-lg p-1">
              {(['1K', '2K', '4K'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setImageSize(size)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    imageSize === size 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default InputForm;
