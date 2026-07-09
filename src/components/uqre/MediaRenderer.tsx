'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuestionImageProps {
  url: string;
  altText?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export const QuestionImage: React.FC<QuestionImageProps> = ({
  url,
  altText = 'Question attachment',
  caption,
  width,
  height,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 dark:border-neutral-850 rounded-2xl p-6 my-4 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-455">
        <ImageOff className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-xs font-semibold">Gambar Gagal Dimuat</p>
        <p className="text-[10px] opacity-75 mt-0.5">{url}</p>
      </div>
    );
  }

  return (
    <div className="my-4">
      <div className="relative group overflow-hidden border border-neutral-200/70 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/20 max-w-lg mx-auto flex items-center justify-center p-2">
        {isLoading && (
          <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-850 animate-pulse rounded-2xl" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={altText}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          onLoad={() => setIsLoading(false)}
          className={`max-h-64 object-contain rounded-xl select-none transition-all duration-300 ${
            isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          style={{ width: width || 'auto', height: height || 'auto' }}
        />
        
        {/* Zoom trigger hover banner */}
        {!isLoading && (
          <button
            onClick={() => setIsOpen(true)}
            className="absolute bottom-3 right-3 p-2 bg-white/95 dark:bg-neutral-900/95 shadow-md border border-neutral-100 dark:border-neutral-800 rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 duration-200"
            aria-label="Zoom image"
          >
            <ZoomIn className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
          </button>
        )}
      </div>

      {caption && (
        <p className="text-center text-[11px] text-neutral-450 mt-2 font-medium italic">
          Gambar: {caption}
        </p>
      )}

      {/* Lightbox / Zoom View Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
            onClick={() => setIsOpen(false)}
          >
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/95 dark:bg-neutral-900/95 border-none rounded-full"
              onClick={() => setIsOpen(false)}
              aria-label="Close image preview"
            >
              <X className="h-4 w-4" />
            </Button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="max-w-4xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={altText}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl select-none"
              />
              {caption && (
                <div className="text-center text-white/90 text-xs mt-3 bg-neutral-900/80 px-4 py-2 rounded-xl max-w-sm mx-auto backdrop-blur-sm">
                  {caption}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
