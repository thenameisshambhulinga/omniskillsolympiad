"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
      }

      if (value.previewUrl) {
        URL.revokeObjectURL(value.previewUrl);
      }
    };
  }, []);

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
      progress += 18;

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
    }, 90);
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

      if (value.previewUrl) {
        URL.revokeObjectURL(value.previewUrl);
      }

      const previewUrl = URL.createObjectURL(file);

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
    },
    [onChange, value],
  );

  const removeImage = () => {
    clearProgressTimer();

    if (value.previewUrl) {
      URL.revokeObjectURL(value.previewUrl);
    }

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
    <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/25 p-4 backdrop-blur-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_34%)]"
        />

        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10">
              <ImagePlus className="h-5 w-5 text-cyan-200" />
            </div>

            <div>
              <p className="text-sm font-black text-white">Profile Image</p>
              <p className="text-[11px] text-white/40">
                JPG, PNG or WEBP · Max{" "}
                {formatFileSize(MAX_PROFILE_IMAGE_SIZE_BYTES)}
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
                ? "relative flex min-h-[18rem] w-full flex-col items-center justify-center rounded-[1.75rem] border border-cyan-300/50 bg-cyan-400/10 p-5 text-center shadow-[0_0_50px_rgba(34,211,238,0.16)] transition"
                : "relative flex min-h-[18rem] w-full flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-white/15 bg-white/[0.035] p-5 text-center transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.055]"
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
                className="relative h-56 w-56 overflow-hidden rounded-full border border-cyan-300/30 bg-black/40 shadow-[0_0_60px_rgba(34,211,238,0.18)]"
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
                <UploadCloud className="h-12 w-12 text-cyan-200" />

                <p className="mt-4 text-lg font-black text-white">
                  Upload profile photo
                </p>

                <p className="mt-2 max-w-xs text-sm leading-6 text-white/45">
                  Drag and drop your image here, or click to browse.
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
                    JPG
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
                    PNG
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
                    WEBP
                  </span>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-cyan-200">
                    Max {formatFileSize(MAX_PROFILE_IMAGE_SIZE_BYTES)}
                  </span>
                </div>
              </>
            )}
          </button>

          {value.error && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200">
              <XCircle className="h-4 w-4" />
              {value.error}
            </div>
          )}

          {value.previewUrl && (
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="truncate text-sm font-bold text-white">
                      {value.fileName}
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      {formatFileSize(value.fileSize)} · {value.mimeType}
                    </p>
                  </div>

                  {value.isValid ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  ) : (
                    <UploadCloud className="h-5 w-5 text-cyan-200" />
                  )}
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value.uploadProgress}%` }}
                    transition={{ duration: 0.25 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 shadow-[0_0_24px_rgba(34,211,238,0.34)]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-400/20"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Replace
                </button>

                <button
                  type="button"
                  onClick={removeImage}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm font-black text-red-100 transition hover:bg-red-400/20"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          )}
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