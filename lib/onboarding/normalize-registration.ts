export type NormalizedRegistrationPayload = {
  personal: {
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    profileImageDataUrl: string;
  };
  academic: {
    collegeName: string;
    university: string;
    usn: string;
    course: string;
    branch: string;
    semester: string;
    state: string;
    district: string;
    pincode: string;
  };
  professional: {
    tagline: string;
    technicalSkills: string[];
    linkedIn: string;
    github: string;
    portfolio: string;
    careerInterests: string[];
  };
};

type NormalizeOptions = {
  fallbackEmail: string;
  hasExistingImage: boolean;
};

type NormalizeResult =
  | {
      success: true;
      data: NormalizedRegistrationPayload;
    }
  | {
      success: false;
      fieldErrors: Record<string, string>;
    };

const MAX_PROFILE_IMAGE_DATA_URL_LENGTH = 900_000;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function cleanString(value: unknown, maxLength = 250): string {
  if (typeof value !== "string") return "";

  return value.trim().slice(0, maxLength);
}

function cleanList(value: unknown, maxItems = 30): string[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();

  return value
    .map((item) => cleanString(item, 80))
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();

      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    })
    .slice(0, maxItems);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isDataImage(value: string): boolean {
  return /^data:image\/(png|jpe?g|webp);base64,/i.test(value);
}

export function normalizeOnboardingPayload(
  input: unknown,
  options: NormalizeOptions,
): NormalizeResult {
  const body = asRecord(input);
  const personal = asRecord(body.personal);
  const academic = asRecord(body.academic);
  const professional = asRecord(body.professional);

  const profileImage = asRecord(personal.profileImage);

  const profileImageDataUrl = cleanString(
    personal.profileImageDataUrl,
    MAX_PROFILE_IMAGE_DATA_URL_LENGTH + 1,
  );

  const previewUrl = cleanString(
    profileImage.previewUrl,
    MAX_PROFILE_IMAGE_DATA_URL_LENGTH + 1,
  );

  const effectiveNewImage = isDataImage(profileImageDataUrl)
    ? profileImageDataUrl
    : isDataImage(previewUrl)
      ? previewUrl
      : "";

  const data: NormalizedRegistrationPayload = {
    personal: {
      fullName: cleanString(personal.fullName, 120),
      email: cleanString(personal.email, 160) || options.fallbackEmail,
      phoneNumber: cleanString(personal.phoneNumber, 30),
      dateOfBirth: cleanString(personal.dateOfBirth, 40),
      profileImageDataUrl: effectiveNewImage,
    },
    academic: {
      collegeName: cleanString(academic.collegeName, 180),
      university: cleanString(academic.university, 180),
      usn: cleanString(academic.usn, 80),
      course: cleanString(academic.course, 100),
      branch: cleanString(academic.branch, 100),
      semester: cleanString(academic.semester, 40),
      state: cleanString(academic.state, 100),
      district: cleanString(academic.district, 100),
      pincode: cleanString(academic.pincode, 20),
    },
    professional: {
      tagline: cleanString(professional.tagline, 120),
      technicalSkills: cleanList(professional.technicalSkills, 40),
      linkedIn: cleanString(professional.linkedIn, 240),
      github: cleanString(professional.github, 240),
      portfolio: cleanString(professional.portfolio, 240),
      careerInterests: cleanList(professional.careerInterests, 30),
    },
  };

  const fieldErrors: Record<string, string> = {};

  if (!data.personal.fullName || data.personal.fullName.length < 2) {
    fieldErrors["personal.fullName"] = "Full name must contain at least 2 characters.";
  }

  if (!isValidEmail(data.personal.email)) {
    fieldErrors["personal.email"] = "Enter a valid email address.";
  }

  if (data.personal.phoneNumber.replace(/\D/g, "").length < 10) {
    fieldErrors["personal.phoneNumber"] = "Phone number must contain at least 10 digits.";
  }

  if (!data.personal.dateOfBirth) {
    fieldErrors["personal.dateOfBirth"] = "Date of birth is required.";
  }

  if (!options.hasExistingImage && !data.personal.profileImageDataUrl) {
    fieldErrors["personal.profileImage"] = "Profile image is required.";
  }

  if (
    data.personal.profileImageDataUrl &&
    data.personal.profileImageDataUrl.length > MAX_PROFILE_IMAGE_DATA_URL_LENGTH
  ) {
    fieldErrors["personal.profileImage"] =
      "Profile image is too large. Please upload an optimized image below 500 KB.";
  }

  const academicRequiredFields: Array<keyof NormalizedRegistrationPayload["academic"]> = [
    "collegeName",
    "university",
    "usn",
    "course",
    "branch",
    "semester",
    "state",
    "district",
    "pincode",
  ];

  for (const field of academicRequiredFields) {
    if (!data.academic[field]) {
      fieldErrors[`academic.${field}`] = "This academic field is required.";
    }
  }

  if (data.professional.tagline.length < 5) {
    fieldErrors["professional.tagline"] =
      "Tagline must contain at least 5 characters.";
  }

  if (data.professional.tagline.length > 120) {
    fieldErrors["professional.tagline"] =
      "Tagline must be 120 characters or fewer.";
  }

  if (data.professional.technicalSkills.length === 0) {
    fieldErrors["professional.technicalSkills"] =
      "Add at least one technical skill.";
  }

  if (data.professional.careerInterests.length === 0) {
    fieldErrors["professional.careerInterests"] =
      "Choose at least one career interest.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      fieldErrors,
    };
  }

  return {
    success: true,
    data,
  };
}
