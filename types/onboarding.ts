export type OnboardingStepId =
  | "personal"
  | "academic"
  | "professional"
  | "review";

export type ProfileImageState = {
  file: File | null;
  previewUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadProgress: number;
  isValid: boolean;
  error: string;
  zoom: number;
  positionX: number;
  positionY: number;
};

export type PersonalInformation = {
  profileImage: ProfileImageState;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
};

export type AcademicInformation = {
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

export type ProfessionalProfile = {
  tagline: string;
  technicalSkills: string[];
  linkedIn: string;
  github: string;
  portfolio: string;
  careerInterests: string[];
};

export type RegistrationFormData = {
  studentId: string;
  personal: PersonalInformation;
  academic: AcademicInformation;
  professional: ProfessionalProfile;
};

export type OnboardingStep = {
  id: OnboardingStepId;
  title: string;
  eyebrow: string;
  description: string;
};

export type ImageValidationResult =
  | {
      valid: true;
      error: "";
    }
  | {
      valid: false;
      error: string;
    };

export const createEmptyProfileImageState = (): ProfileImageState => ({
  file: null,
  previewUrl: "",
  fileName: "",
  fileSize: 0,
  mimeType: "",
  uploadProgress: 0,
  isValid: false,
  error: "",
  zoom: 1,
  positionX: 0,
  positionY: 0,
});

export const createEmptyRegistrationFormData = (): RegistrationFormData => ({
  studentId: "",
  personal: {
    profileImage: createEmptyProfileImageState(),
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
  },
  academic: {
    collegeName: "",
    university: "",
    usn: "",
    course: "",
    branch: "",
    semester: "",
    state: "",
    district: "",
    pincode: "",
  },
  professional: {
    tagline: "",
    technicalSkills: [],
    linkedIn: "",
    github: "",
    portfolio: "",
    careerInterests: [],
  },
});
