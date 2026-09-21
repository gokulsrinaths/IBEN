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
  /** When set, the field only applies (renders, validates, appears in
   * review) if this returns true for the current form values. Used to
   * keep category-irrelevant questions -- e.g. hair colour technique
   * for a nail artist -- from ever being asked. */
  showIf?: (values: Values) => boolean;
};
export const hairCategories = ["Hair Styling", "Hair Colour", "Hair Treatments"];
const isHairProfessional = (values: Values) =>
  hairCategories.includes(values.category);
export const MIN_PORTFOLIO_IMAGES = 3;
export const MAX_PORTFOLIO_IMAGES = 8;
export const serviceOptions = [
  "Haircuts & Styling",
  "Hair Colouring",
  "Hair Treatments",
  "Bridal Hair & Makeup",
  "Party / Event Styling",
  "Everyday Makeup",
  "HD / Airbrush Makeup",
  "Nail Art & Extensions",
  "Manicure & Pedicure",
  "Facials & Skincare",
  "Lash Extensions",
  "Threading & Waxing",
];
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
    name: "servicesOffered",
    label: "Services offered",
    type: "multiselect",
    required: true,
    wide: true,
    options: serviceOptions,
  },
  {
    name: "specialisations",
    label: "Specialisations",
    required: true,
    hint: "Separate areas of expertise with commas.",
    placeholder: "e.g. Balayage, precision cutting, keratin treatments",
  },
  {
    name: "mostBookedServices",
    label: "Most booked services",
    placeholder: "e.g. Bridal hairstyling, balayage colour",
  },
  {
    name: "hairColourServices",
    label: "Hair colour services you provide",
    placeholder: "e.g. Global colour, balayage, highlights, colour correction",
    showIf: isHairProfessional,
  },
  {
    name: "hairTreatments",
    label: "Hair treatments you provide",
    placeholder: "e.g. Keratin, smoothening, hair spa, scalp treatments",
    showIf: isHairProfessional,
  },
  {
    name: "providesConsultations",
    label: "Do you provide client consultations?",
    options: ["Yes", "No"],
  },
  {
    name: "trainingCertifications",
    label: "Professional training / certifications",
    type: "textarea",
    wide: true,
    placeholder: "Institute, course and certification details.",
  },
  {
    name: "providesHomeService",
    label: "Do you provide home services?",
    options: ["Yes", "No"],
  },
  {
    name: "hasOwnEquipment",
    label: "Do you have your own professional equipment?",
    options: ["Yes", "No", "Partially"],
  },
  {
    name: "productsBrands",
    label: "Products / brands you commonly work with",
    placeholder: "e.g. Wella, L'Oreal Professionnel, MAC",
  },
  {
    name: "priceRange",
    label: "Typical service price range",
    placeholder: "e.g. ₹2,000 – ₹8,000 per bridal look",
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
    hint: "Optional -- your uploaded portfolio images below are the main evidence we review.",
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
