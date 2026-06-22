'use client';

import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

export default function GalleryLightbox({ images, limit }) {
  const [activeImg, setActiveImg] = useState(null);

  const list = limit ? images.slice(0, limit) : images;

  if (!list || list.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">
        No images uploaded to the gallery yet.
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {list.map((item, idx) => {
          const imgUrl = item.image || '/assets/extracurricular_sports.png';
          return (
            <div 
              key={item._id || idx}
              onClick={() => setActiveImg(imgUrl)}
              className="group relative h-48 rounded-lg overflow-hidden border border-slate-200 cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <img 
                src={imgUrl} 
                alt={`Gallery image ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <ZoomIn className="text-white" size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeImg && (
        <div 
          onClick={() => setActiveImg(null)}
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button 
            onClick={() => setActiveImg(null)}
            className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full hover:bg-white/20"
          >
            <X size={24} />
          </button>
          <img 
            src={activeImg} 
            alt="Expanded view" 
            className="max-w-full max-h-[85vh] object-contain rounded-md"
          />
        </div>
      )}
    </div>
  );
}
