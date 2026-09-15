export const organization = {
  name: "India Beauty Excellence Network",
  shortName: "IBEN",
  tagline: "Recognising Excellence in Indian Beauty.",
  description:
    "India Beauty Excellence Network identifies, recognises and celebrates exceptional professionals contributing to India's beauty industry.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  emails: {
    general: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    recognition: process.env.NEXT_PUBLIC_RECOGNITION_EMAIL,
    partnerships: process.env.NEXT_PUBLIC_PARTNERSHIPS_EMAIL,
    support: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  },
  leadership: [] as { name: string; role: string; bio: string }[],
  socials: [] as { label: string; url: string }[],
};
export const navigation = [
  { label: "About", href: "/about" },
  { label: "Recognition", href: "/recognition" },
  { label: "Top 50", href: "/top-50" },
  { label: "Professionals", href: "/professionals" },
  { label: "Selection Process", href: "/selection-process" },
  { label: "News", href: "/news" },
];
export const categories = [
  {
    slug: "hair-styling",
    name: "Hair Styling",
    description: "Cutting, finishing and styling techniques.",
    icon: "scissors",
  },
  {
    slug: "hair-colour",
    name: "Hair Colour",
    description: "Colour application, blending and corrective work.",
    icon: "palette",
  },
  {
    slug: "makeup-artistry",
    name: "Makeup Artistry",
    description: "Makeup technique, finish and creative execution.",
    icon: "brush",
  },
  {
    slug: "bridal-beauty",
    name: "Bridal Beauty",
    description: "Beauty work tailored to the bridal brief.",
    icon: "flower",
  },
  {
    slug: "nail-artistry",
    name: "Nail Artistry",
    description: "Nail preparation, finish and detailed design.",
    icon: "gem",
  },
  {
    slug: "skincare-facial",
    name: "Skincare & Facial",
    description: "Considered care and responsible practice.",
    icon: "sun",
  },
  {
    slug: "lash-artistry",
    name: "Lash Artistry",
    description: "Specialist work defined by precision and balance.",
    icon: "eye",
  },
  {
    slug: "hair-treatments",
    name: "Hair Treatments",
    description: "Knowledge-led care and the integrity of healthy hair.",
    icon: "sparkles",
  },
];
export const programs = [
  {
    slug: "top-50",
    name: "IBEN Top 50 Beauty Professionals",
    year: 2026,
    description:
      "A recognition initiative designed to identify and highlight outstanding beauty professionals through defined evaluation criteria.",
    status: "Selection information",
  },
];
export const stages = [
  [
    "Application / Nomination",
    "Share your experience, specialisation and a portfolio that represents your own work.",
  ],
  [
    "Eligibility Review",
    "Information is checked for completeness, professional relevance and category fit.",
  ],
  [
    "Portfolio Review",
    "Selected work is assessed for technique, consistency and authenticity.",
  ],
  [
    "Professional Evaluation",
    "Further context or an interview may be requested to understand your practice.",
  ],
  [
    "Selection",
    "A final review considers the evidence against the published criteria.",
  ],
  [
    "Recognition",
    "Selected professionals are notified and an IBEN recognition record is published.",
  ],
];
export const criteria = [
  [
    "Craft & Technical Skill",
    "Control, precision and techniques appropriate to the category.",
  ],
  [
    "Portfolio Quality",
    "Clear, relevant examples that demonstrate the professional’s own contribution.",
  ],
  [
    "Transformation Quality",
    "Quality of outcomes, with context and truthful before-and-after presentation where applicable.",
  ],
  [
    "Professional Experience",
    "Relevant experience and depth of practice, considered in context.",
  ],
  [
    "Consistency of Work",
    "Evidence of repeatable quality across more than one selected piece.",
  ],
  [
    "Specialisation",
    "Depth of knowledge and a clear point of view within the chosen discipline.",
  ],
  [
    "Professional Conduct",
    "Honest representation, respectful practice and attention to professional responsibilities.",
  ],
];
export const faqs = [
  [
    "What is IBEN?",
    "India Beauty Excellence Network is a professional recognition network dedicated to identifying, recognising and celebrating exceptional professionals contributing to India’s beauty industry.",
  ],
  [
    "Who can apply?",
    "Beauty professionals working in India, including salon professionals, independent practitioners and salon owners who actively practise their craft, may put forward their work in a relevant category.",
  ],
  [
    "Can someone nominate me?",
    "Yes. A colleague, client or industry participant may nominate a professional. The nominee may be asked for further information and consent before assessment.",
  ],
  [
    "How are professionals selected?",
    "Applications go through eligibility review, portfolio assessment, professional evaluation and final review. Craft, portfolio quality, consistency, experience, specialisation and conduct inform assessment.",
  ],
  [
    "Does applying guarantee recognition?",
    "No. Recognition is not guaranteed by application, nomination, payment, membership, or participation. Only a completed review and selection decision can result in recognition.",
  ],
  [
    "Is IBEN recognition a professional licence?",
    "No. IBEN recognition reflects an assessment within an IBEN initiative. It is not government approval, accreditation, a professional licence or verification of a person’s legal right to practise.",
  ],
  [
    "What is IBEN Top 50?",
    "IBEN Top 50 Beauty Professionals 2026 is the network’s flagship recognition initiative. It is designed to highlight selected professionals against defined criteria, rather than rank every beauty professional in India.",
  ],
  [
    "Can freelancers apply?",
    "Yes. Independent and freelance professionals may apply with a relevant portfolio and details of their experience.",
  ],
  [
    "Can salon professionals apply?",
    "Yes. Employed salon professionals and practising salon owners may apply. Recognition relates to the individual’s work and does not automatically extend to the salon.",
  ],
  [
    "How do I update my professional profile?",
    "Use the professional support enquiry form and include your IBEN profile ID, the requested correction and supporting information. Changes require review before publication.",
  ],
  [
    "How can recognition be verified?",
    "Search the IBEN directory and match the name, profile ID, programme and year. A record confirms only information published in IBEN’s own records. If no record is available, contact IBEN rather than assuming a claim is valid.",
  ],
  [
    "Are applications currently being accepted?",
    "Online submissions are not yet available. You can review the form and prepare your information, but it will not be sent or saved. Intake details will be published when confirmed.",
  ],
];
export type Professional = {
  slug: string;
  name: string;
  city: string;
  state: string;
  category: string;
  specialisations: string[];
  recognition: string;
  year: number;
  profileId: string;
  image: string;
  bio: string;
  experience: string;
  portfolio: { image: string; caption: string }[];
};
export const professionals: Professional[] = [];
export type News = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  paragraphs: string[];
};
export const news: News[] = [];
export const newsCategories = [
  "Recognition",
  "IBEN Updates",
  "Professional Stories",
  "Industry",
];
export const routes = [
  "",
  "about",
  "recognition",
  "top-50",
  "professionals",
  "categories",
  "apply",
  "nominate",
  "selection-process",
  "standards",
  "news",
  "contact",
  "faq",
  "privacy",
  "terms",
];
