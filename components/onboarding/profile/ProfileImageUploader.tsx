"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ImagePlus,
  RefreshCcw,
  Trash2,
  UploadCloud,
  XCircle,
} from "lucide-react";

import CropRepositionPanel from "@/components/onboarding/profile/CropRepositionPanel";
import type { ProfileImageState } from "@/types/onboarding";
import {
  MAX_PROFILE_IMAGE_SIZE_BYTES,
  formatFileSize,
  validateProfileImage,
} from "@/utils/validateProfileImage";

export default function ProfileImageUploader({
  value,
  onChange,
}: {
  value: ProfileImageState;
  onChange: (value: ProfileImageState) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const clearProgressTimer = () => {
    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const simulateProgress = (nextState: ProfileImageState) => {
    clearProgressTimer();

    onChange({
      ...nextState,
      uploadProgress: 12,
    });

    let progress = 12;

    progressTimerRef.current = window.setInterval(() => {
      progress += 22;

      if (progress >= 100) {
        clearProgressTimer();
        onChange({
          ...nextState,
          uploadProgress: 100,
          isValid: true,
        });
        return;
      }

      onChange({
        ...nextState,
        uploadProgress: progress,
      });
    }, 80);
  };

  const handleFile = useCallback(
    (file: File | null) => {
      const validation = validateProfileImage(file);

      if (!validation.valid || !file) {
        onChange({
          ...value,
          file: null,
          fileName: "",
          fileSize: 0,
          mimeType: "",
          uploadProgress: 0,
          isValid: false,
          error: validation.error,
        });
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const previewUrl =
          typeof reader.result === "string" ? reader.result : "";

        const nextState: ProfileImageState = {
          file,
          previewUrl,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          uploadProgress: 0,
          isValid: false,
          error: "",
          zoom: 1,
          positionX: 50,
          positionY: 50,
        };

        simulateProgress(nextState);
      };

      reader.readAsDataURL(file);
    },
    [onChange, value],
  );

  const removeImage = () => {
    clearProgressTimer();

    onChange({
      file: null,
      previewUrl: "",
      fileName: "",
      fileSize: 0,
      mimeType: "",
      uploadProgress: 0,
      isValid: false,
      error: "Profile image is required.",
      zoom: 1,
      positionX: 50,
      positionY: 50,
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const updateCropValues = (updates: {
    zoom?: number;
    positionX?: number;
    positionY?: number;
  }) => {
    onChange({
      ...value,
      ...updates,
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50">
              <ImagePlus className="h-5 w-5 text-sky-600" />
            </div>

            <div>
              <p className="text-base font-black text-slate-800">Profile Image</p>
              <p className="text-xs font-medium text-slate-500">
                JPG, PNG or WEBP · Max {formatFileSize(MAX_PROFILE_IMAGE_SIZE_BYTES)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              handleFile(event.dataTransfer.files[0] ?? null);
            }}
            className={
              isDragging
                ? "relative flex min-h-[18rem] w-full flex-col items-center justify-center rounded-[1.75rem] border border-sky-300 bg-sky-50 p-5 text-center shadow-[0_0_0_6px_rgba(56,189,248,0.08)] transition"
                : "relative flex min-h-[18rem] w-full flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/90 p-5 text-center transition hover:border-sky-300 hover:bg-sky-50"
            }
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
            />

            {value.previewUrl ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative h-56 w-56 overflow-hidden rounded-full border border-sky-200 bg-white shadow-[0_12px_30px_rgba(56,189,248,0.12)]"
              >
                <img
                  src={value.previewUrl}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                  style={{
                    transform: `scale(${value.zoom})`,
                    objectPosition: `${value.positionX}% ${value.positionY}%`,
                  }}
                />
              </motion.div>
            ) : (
              <>
                <UploadCloud className="h-12 w-12 text-sky-600" />
                <p className="mt-4 text-lg font-black text-slate-800">
                  Upload profile photo
                </p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                  Drag and drop your image here, or click to browse.
                </p>
              </>
            )}
          </button>

          {value.error ? (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              <XCircle className="h-4 w-4" />
              {value.error}
            </div>
          ) : null}

          {value.previewUrl ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">
                      Current profile image
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatFileSize(value.fileSize)} · {value.mimeType}
                    </p>
                  </div>

                  {value.isValid ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <UploadCloud className="h-5 w-5 text-sky-600" />
                  )}
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value.uploadProgress}%` }}
                    transition={{ duration: 0.25 }}
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-black text-sky-700 transition hover:bg-sky-100"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Replace
                </button>

                <button
                  type="button"
                  onClick={removeImage}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <CropRepositionPanel
        zoom={value.zoom}
        positionX={value.positionX}
        positionY={value.positionY}
        onChange={updateCropValues}
        onReset={() =>
          onChange({
            ...value,
            zoom: 1,
            positionX: 50,
            positionY: 50,
          })
        }
      />
    </div>
  );
}
