'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function QRZoomModal({ imageSrc, onClose }) {
  if (!imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full bg-[#14161f] border border-[#2d3345] rounded-2xl p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#202533] border border-[#3b4359] text-white flex items-center justify-center hover:bg-[#a3e635] hover:text-black transition-colors"
          aria-label="Close zoomed QR"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-white rounded-xl p-3 shadow-inner">
          <img
            src={imageSrc}
            alt="Zoomed Payment QR"
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>

        <p className="text-center mt-3 text-[#a3e635] font-bold tracking-widest uppercase text-[11px] animate-pulse">
          Click anywhere outside to close
        </p>
      </div>
    </div>
  );
}
