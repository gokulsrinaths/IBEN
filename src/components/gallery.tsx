"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function ProfileGallery({
  items,
}: {
  items: { image: string; caption: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (openIndex === null) return;
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowLeft")
        setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIndex, items.length]);

  if (!items.length) return <p>A public portfolio has not been published for this record.</p>;

  const active = openIndex !== null ? items[openIndex] : null;

  return (
    <>
      <div className="gallery-grid">
        {items.map((work, i) => (
          <button
            key={work.image}
            type="button"
            className="gallery-tile"
            onClick={() => setOpenIndex(i)}
            aria-label={`Open ${work.caption || "portfolio image"} in full size`}
          >
            <Image src={work.image} alt={work.caption} fill sizes="(max-width:767px) 50vw, 25vw" />
          </button>
        ))}
      </div>
      {active && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption || "Portfolio image"}
          onClick={() => setOpenIndex(null)}
        >
          <button
            ref={closeButton}
            type="button"
            className="lightbox-nav lightbox-close"
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
          >
            <X size={22} />
          </button>
          {items.length > 1 && (
            <button
              type="button"
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={26} />
            </button>
          )}
          <figure onClick={(e) => e.stopPropagation()}>
            <Image
              src={active.image}
              alt={active.caption}
              width={900}
              height={1050}
              className="lightbox-image"
            />
            {active.caption && <figcaption>{active.caption}</figcaption>}
          </figure>
          {items.length > 1 && (
            <button
              type="button"
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
              }}
              aria-label="Next image"
            >
              <ChevronRight size={26} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
