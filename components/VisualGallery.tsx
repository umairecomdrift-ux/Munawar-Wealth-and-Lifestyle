
import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { Image as ImageIcon, Edit3, Download, Loader2, X, Check } from 'lucide-react';
import { editImage } from '../services/geminiService';

interface VisualGalleryProps {
  images: GeneratedImage[];
  setImages: React.Dispatch<React.SetStateAction<GeneratedImage[]>>;
}

const VisualGallery: React.FC<VisualGalleryProps> = ({ images, setImages }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = async (img: GeneratedImage) => {
    if (!editPrompt.trim() || isUpdating) return;
    
    setIsUpdating(true);
    try {
      const newUrl = await editImage(img.url, editPrompt);
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, url: newUrl } : i));
      setEditingId(null);
      setEditPrompt('');
    } catch (err) {
      console.error("Edit failed", err);
      alert("Failed to update the conceptual visual.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900">
        <ImageIcon className="w-5 h-5 text-slate-400" />
        Conceptual Visualizations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm group">
            <div className="aspect-square relative overflow-hidden bg-slate-50">
              <img 
                src={img.url} 
                alt={img.prompt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  onClick={() => setEditingId(img.id)}
                  className="p-3 bg-white text-slate-900 rounded-full hover:bg-slate-100 transition-colors shadow-lg"
                  title="Refine with text"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <a 
                  href={img.url} 
                  download={`munawar-viz-${img.id}.png`}
                  className="p-3 bg-white text-slate-900 rounded-full hover:bg-slate-100 transition-colors shadow-lg"
                  title="Download Asset"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="p-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{img.prompt}</p>
            </div>

            {/* Editing UI */}
            {editingId === img.id && (
              <div className="absolute inset-0 bg-white/95 p-6 flex flex-col justify-center animate-in fade-in zoom-in duration-200 z-10">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Refine Vision</h4>
                  <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-900">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="e.g., 'Add more contrast', 'Make it even more minimal'..."
                  className="w-full h-24 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none mb-4"
                />
                <button
                  onClick={() => handleEdit(img)}
                  disabled={isUpdating || !editPrompt.trim()}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Refining...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Update Visual
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualGallery;
