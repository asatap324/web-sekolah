"use client";

import { useFileUpload } from "@/hooks/use-file-upload";

import { ImageUpIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  onFileSelect: (file: File | null) => void;
  initialUrl?: string | null; // 👉 tambah prop ini
};

export default function UploadThumbnails({ onFileSelect, initialUrl }: Props) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialUrl || null,
  );
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxSize,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      onFileSelect(file);
    } else {
      setPreviewUrl(initialUrl || null); // fallback ke gambar lama
      onFileSelect(null);
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="relative">
        <div
          role="button"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input hover:bg-accent/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors"
        >
          <input
            className="sr-only"
            aria-label="Upload file"
            {...getInputProps()}
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
          {previewUrl ? (
            <div className="absolute inset-0 bg-accent">
              <img
                src={previewUrl}
                alt="Uploaded thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageUpIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">
                Drop your image here or click to browse
              </p>
              <p className="text-muted-foreground text-xs">
                Max size: {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
