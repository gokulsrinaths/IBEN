"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, ArrowUpRight } from "lucide-react";

const STORAGE_KEY = "iben-apply-popup-seen";

export function ApplyPopup() {
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="apply-popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-popup-title"
      onClick={dismiss}
    >
      <div className="apply-popup" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeButton}
          type="button"
          className="apply-popup-close"
          onClick={dismiss}
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <p className="eyebrow">India Beauty Excellence Network</p>
        <h2 id="apply-popup-title">Apply for Recognition at IBEN</h2>
        <p>
          Put your work forward for consideration. Applications are open now
          and reviewed against defined criteria.
        </p>
        <div className="apply-popup-actions">
          <Link href="/apply" className="button button-dark" onClick={dismiss}>
            Apply for Recognition
            <ArrowUpRight size={16} />
          </Link>
          <button type="button" className="text-link" onClick={dismiss}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
