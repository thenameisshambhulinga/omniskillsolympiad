import type { ImageValidationResult } from "@/types/onboarding";

export const ALLOWED_PROFILE_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_PROFILE_IMAGE_SIZE_BYTES = 1024 * 1024;

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateProfileImage(file: File | null): ImageValidationResult {
  if (!file) {
    return {
      valid: false,
      error: "Profile image is required.",
    };
  }

  if (
    !ALLOWED_PROFILE_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_PROFILE_IMAGE_TYPES)[number],
    )
  ) {
    return {
      valid: false,
      error: "Only JPG, PNG, and WEBP images are allowed.",
    };
  }

  if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: "Profile image must be less than 1 MB",
    };
  }

  return {
    valid: true,
    error: "",
  };
}
