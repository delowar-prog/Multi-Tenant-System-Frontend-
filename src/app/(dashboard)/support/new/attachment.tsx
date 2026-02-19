"use client";

import { useRef, useState } from "react";
type Props = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

export default function AttachmentUpload({ files, setFiles }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // hidden input trigger
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-slate-200">
        <span>Add Attachment</span>
        <button
          type="button"
          onClick={handleButtonClick}
          className="inline-flex h-8 w-10 items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
        >
          +
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview */}
      <div className="mt-3 flex flex-wrap gap-3">
        {files.map((file, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="h-20 w-20 rounded-md object-cover"
            />

            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
