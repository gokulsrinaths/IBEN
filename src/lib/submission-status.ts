export const submissionStatuses = [
  "submitted",
  "under_review",
  "more_info_required",
  "shortlisted",
  "selected",
  "not_selected",
] as const;
export type SubmissionStatus = (typeof submissionStatuses)[number];
export const statusLabels: Record<SubmissionStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  more_info_required: "More Information Required",
  shortlisted: "Shortlisted",
  selected: "Selected",
  not_selected: "Not Selected",
};
