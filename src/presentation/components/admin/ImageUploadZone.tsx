'use client';

import * as React from 'react';
import { uploadImageAction } from '../../actions/questionActions';
import { Loader2, ImagePlus, AlertCircle } from 'lucide-react';

interface ImageUploadZoneProps {
  initialUrl?: string;
  onUploadComplete: (url: string) => void;
}

export function ImageUploadZone({ initialUrl, onUploadComplete }: ImageUploadZoneProps) {
  const [imageUrl, setImageUrl] = React.useState(initialUrl || '');
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await uploadImageAction(formData);
      if (res.success && res.data?.imageUrl) {
        const url = res.data.imageUrl;
        setImageUrl(url);
        onUploadComplete(url);
      } else {
        setError(res.error?.message || 'Failed to upload image.');
      }
    } catch (err) {
      setError('An unexpected error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Question Illustration (Optional)</label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs text-neutral-400 font-semibold">Uploading illustration...</span>
          </>
        ) : imageUrl ? (
          <div className="text-center space-y-2">
            <img src={imageUrl} alt="Uploaded preview" className="max-h-24 max-w-full rounded-lg mx-auto border border-neutral-200 dark:border-neutral-800" />
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">✓ Illustration loaded. Click to replace.</span>
          </div>
        ) : (
          <>
            <ImagePlus className="h-6 w-6 text-neutral-400" />
            <span className="text-xs text-neutral-400 font-semibold">Click to select question drawing or figure</span>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-semibold">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
