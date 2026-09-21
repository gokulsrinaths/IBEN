"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft, Upload, CheckCircle2 } from "lucide-react";
import { categories } from "@/lib/data";
import {
  personal,
  practice,
  nomination,
  contact,
  validateField,
  hairCategories,
  MIN_PORTFOLIO_IMAGES,
  MAX_PORTFOLIO_IMAGES,
  type Values,
  type FieldSpec,
} from "@/lib/form-fields";
import {
  submitForm,
  formCopy,
  checkAvailability,
  uploadPortfolioFile,
} from "@/lib/submission-client";
function Field({
  spec: s,
  values,
  onChange,
}: {
  spec: FieldSpec;
  values: Values;
  onChange: (name: string, value: string) => void;
}) {
  const common = {
    id: s.name,
    name: s.name,
    required: s.required,
    value: values[s.name] || "",
    onChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      e.target.setCustomValidity("");
      onChange(s.name, e.target.value);
    },
    "aria-describedby": s.hint ? `${s.name}-hint` : undefined,
  };
  if (s.type === "multiselect") {
    const selected = (values[s.name] || "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    const toggle = (option: string, checked: boolean) => {
      const next = checked
        ? [...selected, option]
        : selected.filter((v) => v !== option);
      onChange(s.name, next.join(", "));
    };
    return (
      <fieldset className={`field checkbox-group ${s.wide ? "wide" : ""}`}>
        <legend>
          {s.label}
          {s.required && <span aria-label="required"> *</span>}
        </legend>
        <div className="checkbox-grid">
          {(s.options || []).map((option) => (
            <label key={option} className="checkbox-field">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={(e) => toggle(option, e.target.checked)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }
  return (
    <label className={`field ${s.wide ? "wide" : ""}`} htmlFor={s.name}>
      <span>
        {s.label}
        {s.required && <span aria-label="required"> *</span>}
      </span>
      {s.options ? (
        <select {...common}>
          <option value="">Select an option</option>
          {s.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : s.type === "textarea" ? (
        <textarea
          {...common}
          rows={4}
          maxLength={5000}
          placeholder={s.placeholder}
        />
      ) : (
        <input
          {...common}
          type={s.type || "text"}
          placeholder={s.placeholder}
          min={s.min}
          max={s.max}
          maxLength={s.type === "number" ? undefined : 500}
          step={s.type === "number" ? 1 : undefined}
          autoComplete={
            s.type === "email"
              ? "email"
              : s.type === "tel"
                ? "tel"
                : s.name === "fullName" || s.name === "name"
                  ? "name"
                  : s.name === "city"
                    ? "address-level2"
                    : s.name === "state"
                      ? "address-level1"
                      : undefined
          }
          inputMode={s.type === "tel" ? "tel" : undefined}
        />
      )}{" "}
      {s.hint && <small id={`${s.name}-hint`}>{s.hint}</small>}
    </label>
  );
}
export function ApplicationForm({
  initialCategory = "",
}: {
  initialCategory?: string;
}) {
  return (
    <RecognitionForm kind="application" initialCategory={initialCategory} />
  );
}
export function NominationForm() {
  return <RecognitionForm kind="nomination" />;
}
export function ContactForm() {
  return <RecognitionForm kind="contact" />;
}
function RecognitionForm({
  kind,
  initialCategory = "",
}: {
  kind: "application" | "nomination" | "contact";
  initialCategory?: string;
}) {
  const application = kind === "application";
  const copy = formCopy[kind];
  const [pending, setPending] = useState(false);
  const [reference, setReference] = useState("");
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({
    category: categories.find((c) => c.slug === initialCategory)?.name || "",
  });
  const [files, setFiles] = useState<
    { file: File; path?: string; uploading: boolean; failed?: boolean }[]
  >([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    let cancelled = false;
    checkAvailability().then((ok) => {
      if (!cancelled) setAvailable(ok);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const allSpecs = application
    ? step === 0
      ? personal
      : step === 1
        ? practice
        : []
    : kind === "nomination"
      ? nomination
      : contact;
  const specs = allSpecs.filter((s) => !s.showIf || s.showIf(values));
  const setValue = (name: string, value: string) => {
    setValues((v) => {
      const next = { ...v, [name]: value };
      if (name === "category" && !hairCategories.includes(value)) {
        delete next.hairColourServices;
        delete next.hairTreatments;
      }
      return next;
    });
    setSuccess(false);
  };
  const move = (next: number) => {
    setStep(next);
    setError("");
    setTimeout(() => {
      heading.current?.focus();
      heading.current?.scrollIntoView({ behavior: "instant", block: "center" });
    }, 0);
  };
  const validate = () => {
    let multiselectOk = true;
    for (const spec of specs) {
      if (spec.type === "multiselect") {
        if (spec.required && !(values[spec.name] || "").trim()) {
          setError(`Select at least one option for “${spec.label}”.`);
          multiselectOk = false;
        }
        continue;
      }
      const input = form.current?.elements.namedItem(spec.name) as
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
      input?.setCustomValidity(validateField(spec, values[spec.name] || ""));
    }
    return Boolean(form.current?.reportValidity()) && multiselectOk;
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setError("");
    setSuccess(false);
    if (!validate()) return;
    if (application && step === 1 && files.length < MIN_PORTFOLIO_IMAGES) {
      setError(
        `Add at least ${MIN_PORTFOLIO_IMAGES} portfolio images before continuing.`,
      );
      return;
    }
    if (application && step < 2) {
      move(step + 1);
      return;
    }
    if (files.some((f) => f.uploading)) {
      setError("Wait for your portfolio images to finish uploading.");
      return;
    }
    if (files.some((f) => f.failed)) {
      setError("Remove any portfolio images that failed to upload.");
      return;
    }
    setPending(true);
    try {
      const portfolioObjectKeys = files
        .map((f) => f.path)
        .filter((p): p is string => Boolean(p));
      const result = await submitForm({
        kind,
        values: portfolioObjectKeys.length
          ? { ...values, portfolioObjectKeys: JSON.stringify(portfolioObjectKeys) }
          : values,
        files: [],
      });
      if (result.ok) {
        setReference(result.reference);
        setSuccess(true);
      } else
        setError(result.code === "unavailable" ? copy.unavailable : copy.error);
    } catch {
      setError(copy.error);
    } finally {
      setPending(false);
    }
  };
  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || []);
    setError("");
    if (files.length + incoming.length > MAX_PORTFOLIO_IMAGES) {
      setError(`Choose up to ${MAX_PORTFOLIO_IMAGES} portfolio images in total.`);
      e.target.value = "";
      return;
    }
    if (
      incoming.some(
        (f) =>
          !["image/jpeg", "image/png", "image/webp"].includes(f.type) ||
          f.size > 5 * 1024 * 1024,
      )
    ) {
      setError("Use JPG, PNG or WebP images, each no larger than 5 MB.");
      e.target.value = "";
      return;
    }
    const fresh = incoming.filter(
      (f) => !files.some((o) => o.file.name === f.name && o.file.size === f.size),
    );
    setFiles((old) => [
      ...old,
      ...fresh.map((file) => ({ file, uploading: available === true })),
    ]);
    setSuccess(false);
    e.target.value = "";
    if (available !== true) return;
    for (const file of fresh) {
      uploadPortfolioFile(file).then((result) => {
        setFiles((old) =>
          old.map((f) =>
            f.file === file
              ? result.ok
                ? { ...f, uploading: false, path: result.path }
                : { ...f, uploading: false, failed: true }
              : f,
          ),
        );
      });
    }
  };
  return (
    <div className="form-panel">
      {application && (
        <ol className="form-steps" aria-label="Application progress">
          {["Your details", "Your practice", "Review & declaration"].map(
            (s, i) => (
              <li
                key={s}
                className={step >= i ? "active" : ""}
                aria-current={step === i ? "step" : undefined}
              >
                0{i + 1} · {s}
              </li>
            ),
          )}
        </ol>
      )}
      <h2 className="form-title" ref={heading} tabIndex={-1}>
        {application
          ? [
              "Let’s start with you.",
              "Tell us about your craft.",
              "Review your application.",
            ][step]
          : kind === "nomination"
            ? "Put exceptional work forward."
            : "How can we help?"}
      </h2>
      <p className="form-description">
        {application && step === 2
          ? "Check your details and declarations before continuing."
          : "Fields marked * are required."}
      </p>
      {available === false && (
        <div className="notice">
          <strong>{copy.notice}</strong> Entries and images remain on this
          page while submissions are unavailable. Leaving or reloading clears
          them.
        </div>
      )}
      <form ref={form} onSubmit={submit} noValidate aria-busy={pending}>
        <fieldset disabled={pending} className="form-fields">
          <div className="form-grid">
            {specs.map((s) => (
              <Field
                key={s.name}
                spec={s}
                values={values}
                onChange={setValue}
              />
            ))}
          </div>
          {application && step === 1 && (
            <div className="wide" style={{ marginTop: 25 }}>
              <label className="field" htmlFor="portfolioFiles">
                <span>
                  Portfolio images<span aria-label="required"> *</span>
                </span>
              </label>
              <div className="upload-zone">
                <Upload size={25} />
                <p>
                  {MIN_PORTFOLIO_IMAGES}–{MAX_PORTFOLIO_IMAGES} images · JPG, PNG or WebP · 5 MB each
                  <br />
                  Select only work and images you have permission to share.
                </p>
                <p id="upload-guidance">
                  HEIC/HEIF images are not supported. Export them as JPG
                  first.{" "}
                  {available === true
                    ? "Images upload as soon as you select them."
                    : "Images are previewed locally and are not uploaded while submissions are unavailable."}
                </p>
                <input
                  aria-describedby="upload-guidance"
                  id="portfolioFiles"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={addFiles}
                />
              </div>
              <ul className="file-list preview-list">
                {files.map((f, i) => (
                  <li key={`${f.file.name}-${i}`}>
                    <UploadPreview file={f.file} />
                    <span>
                      {f.file.name} · {(f.file.size / 1024 / 1024).toFixed(1)} MB
                      {f.uploading && " · Uploading..."}
                      {f.failed && " · Upload failed"}
                      {f.path && " · Uploaded"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((_, j) => j !== i))}
                      aria-label={`Remove ${f.file.name}`}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {application && step === 2 && (
            <dl className="review-list">
              {[...personal, ...practice]
                .filter((s) => !s.showIf || s.showIf(values))
                .map((s) => (
                <div key={s.name}>
                  <dt>{s.label}</dt>
                  <dd>{values[s.name] || "Not provided"}</dd>
                </div>
              ))}
              <div>
                <dt>Portfolio images</dt>
                <dd>
                  {files.length
                    ? files.map((f) => f.file.name).join(", ")
                    : "Not provided"}
                </dd>
              </div>
            </dl>
          )}
          {(!application || step === 2) && (
            <>
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  checked={values.consent === "yes"}
                  onChange={(e) =>
                    setValue("consent", e.target.checked ? "yes" : "")
                  }
                />
                <span>
                  I have read the{" "}
                  <Link href="/privacy" target="_blank">
                    privacy notice (opens a new tab)
                  </Link>{" "}
                  and understand that no information is submitted until IBEN
                  confirms receipt. *
                </span>
              </label>
              {kind !== "contact" && (
                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    name="accuracy"
                    required
                    checked={values.accuracy === "yes"}
                    onChange={(e) =>
                      setValue("accuracy", e.target.checked ? "yes" : "")
                    }
                  />
                  <span>
                    I confirm that the information is accurate to the best of my
                    knowledge and that I have permission to share the
                    information, images and portfolio links provided. I understand that
                    recognition is subject to review and is not guaranteed. *
                  </span>
                </label>
              )}
            </>
          )}
          {error && (
            <p role="alert" className="status-message error">
              {error}
            </p>
          )}
          {success && (
            <div role="status" className="status-message">
              <CheckCircle2 size={18} />
              <strong>{copy.success}</strong> Reference: {reference}.{" "}
              {copy.nextStep}
            </div>
          )}
          <div className="form-actions">
            {application && step > 0 ? (
              <button
                type="button"
                className="button button-outline"
                onClick={() => move(step - 1)}
              >
                <ArrowLeft size={15} />
                Back
              </button>
            ) : (
              <span />
            )}
            <button
              type="submit"
              className="button button-dark"
              disabled={pending || success}
            >
              {application && step < 2 ? (
                <>
                  Continue
                  <ArrowRight size={15} />
                </>
              ) : (
                <>
                  {pending ? "Checking availability..." : copy.action}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

function UploadPreview({ file }: { file: File }) {
  const [url, setUrl] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setUrl(reader.result);
    };
    reader.onerror = () => setFailed(true);
    reader.readAsDataURL(file);
    return () => {
      reader.onload = null;
      reader.onerror = null;
      if (reader.readyState === FileReader.LOADING) reader.abort();
    };
  }, [file]);
  return url && !failed ? (
    <Image
      src={url}
      alt={`Preview of ${file.name}`}
      width={88}
      height={88}
      unoptimized
      onError={() => setFailed(true)}
    />
  ) : (
    <span className="preview-fallback">
      {failed ? "Preview unavailable" : "Loading preview"}
    </span>
  );
}
