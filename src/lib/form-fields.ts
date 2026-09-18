import { categories } from "./data";
export type Values = Record<string, string>;
export type FieldSpec = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: string[];
  wide?: boolean;
  hint?: string;
  min?: number;
  max?: number;
  placeholder?: string;
};
export const personal: FieldSpec[] = [
  { name: "fullName", label: "Full name", required: true, placeholder: "e.g. Priya Sharma" },
  {
    name: "phone",
    label: "Phone number",
    type: "tel",
    required: true,
    hint: "Include your country code, e.g. +91.",
    placeholder: "e.g. +91 98765 43210",
  },
  {
    name: "email",
    label: "Email address",
    type: "email",
    required: true,
    placeholder: "e.g. priya@example.com",
  },
  { name: "city", label: "City", required: true, placeholder: "e.g. Mumbai" },
  {
    name: "state",
    label: "State / Union territory",
    required: true,
    placeholder: "e.g. Maharashtra",
  },
  {
    name: "experience",
    label: "Years of experience",
    type: "number",
    required: true,
    min: 0,
    max: 80,
    placeholder: "e.g. 5",
  },
];
export const practice: FieldSpec[] = [
  {
    name: "professionalType",
    label: "Professional type",
    required: true,
    options: [
      "Salon Professional",
      "Independent/Freelance Professional",
      "Salon Owner / Professional",
    ],
  },
  {
    name: "category",
    label: "Primary category",
    required: true,
    options: categories.map((c) => c.name),
  },
  {
    name: "specialisations",
    label: "Specialisations",
    required: true,
    hint: "Separate areas of expertise with commas.",
    placeholder: "e.g. Balayage, precision cutting, keratin treatments",
  },
  {
    name: "workplace",
    label: "Current workplace / salon",
    placeholder: "e.g. Studio name or salon",
  },
  {
    name: "profileUrl",
    label: "Instagram / professional profile URL",
    type: "url",
    placeholder: "https://instagram.com/yourhandle",
  },
  {
    name: "portfolioUrl",
    label: "Portfolio URL",
    type: "url",
    required: true,
    hint: "Use an accessible https:// link to work you have permission to share.",
    placeholder: "https://yourportfolio.example.com",
  },
  {
    name: "bio",
    label: "Professional bio",
    type: "textarea",
    required: true,
    wide: true,
    placeholder:
      "Describe your professional background, training and approach.",
  },
  {
    name: "achievements",
    label: "Major achievements",
    type: "textarea",
    wide: true,
    placeholder: "Awards, features, certifications or notable collaborations.",
  },
  {
    name: "reason",
    label: "Why should your work be considered for IBEN recognition?",
    type: "textarea",
    required: true,
    wide: true,
    placeholder:
      "Be specific about technique, consistency and the results your clients see.",
  },
];
export const nomination: FieldSpec[] = [
  { name: "nominatorName", label: "Your name", required: true, placeholder: "e.g. Anjali Mehta" },
  {
    name: "nominatorEmail",
    label: "Your email",
    type: "email",
    required: true,
    placeholder: "e.g. anjali@example.com",
  },
  {
    name: "relationship",
    label: "Relationship to professional",
    required: true,
    options: [
      "Client",
      "Colleague",
      "Employer",
      "Industry participant",
      "Other",
    ],
    wide: true,
  },
  {
    name: "nomineeName",
    label: "Professional name",
    required: true,
    placeholder: "e.g. Priya Sharma",
  },
  {
    name: "city",
    label: "Professional’s city",
    required: true,
    placeholder: "e.g. Mumbai",
  },
  {
    name: "category",
    label: "Category",
    required: true,
    options: categories.map((c) => c.name),
  },
  {
    name: "portfolioUrl",
    label: "Instagram / portfolio URL",
    type: "url",
    required: true,
    placeholder: "https://instagram.com/theirhandle",
  },
  {
    name: "reason",
    label: "Reason for nomination",
    type: "textarea",
    required: true,
    wide: true,
    placeholder: "Why does this person's work deserve recognition?",
  },
];
export const contact: FieldSpec[] = [
  { name: "name", label: "Your name", required: true, placeholder: "e.g. Priya Sharma" },
  {
    name: "email",
    label: "Email address",
    type: "email",
    required: true,
    placeholder: "e.g. priya@example.com",
  },
  {
    name: "topic",
    label: "Enquiry type",
    required: true,
    options: [
      "General enquiries",
      "Recognition enquiries",
      "Partnership enquiries",
      "Professional support",
    ],
    wide: true,
  },
  {
    name: "message",
    label: "Your message",
    type: "textarea",
    required: true,
    wide: true,
    placeholder: "Tell us what you'd like help with.",
  },
];

export function isValidPhone(value: string): boolean {
  const phone = value.trim();
  if (!/^\+?[0-9 () .-]+$/.test(phone)) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}
export function validateField(spec: FieldSpec, value: string): string {
  if (spec.required && !value.trim()) return "Please complete this field.";
  if (!value) return "";
  if (spec.type === "tel" && !isValidPhone(value))
    return "Enter a phone number with 7–15 digits. You can include +, spaces, brackets or hyphens.";
  if (spec.type === "url") {
    try {
      if (!["http:", "https:"].includes(new URL(value).protocol))
        return "Use an http:// or https:// address.";
    } catch {
      return "Enter a complete website address, including https://.";
    }
  }
  return "";
}
