'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function QRZoomModal({ imageSrc, onClose }) {
  if (!imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full bg-[#FAF9F5] border border-black/15 rounded-2xl p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#141413] text-[#FAF9F5] flex items-center justify-center hover:bg-black transition-colors"
          aria-label="Close zoomed QR"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-white rounded-xl p-3 border border-black/10">
          <img
            src={imageSrc}
            alt="Zoomed Settlement QR"
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>

        <p className="text-center mt-3 text-[#63625D] font-mono uppercase text-[10px] tracking-wider">
          Click anywhere outside to dismiss
        </p>
      </div>
    </div>
  );
}
