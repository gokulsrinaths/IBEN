"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories, programs } from "@/lib/data";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type PortfolioItem = { image: string; caption: string; uploading?: boolean };

export function PublishForm({
  submissionId,
  initial,
}: {
  submissionId: string;
  initial: {
    name: string;
    city: string;
    state: string;
    category: string;
    specialisations: string;
    bio: string;
    experience: string;
  };
}) {
  const router = useRouter();
  const [name] = useState(initial.name);
  const [slug, setSlug] = useState(slugify(initial.name));
  const [city, setCity] = useState(initial.city);
  const [state, setState] = useState(initial.state);
  const [category, setCategory] = useState(
    categories.find((c) => c.name === initial.category)?.name || categories[0].name,
  );
  const [specialisations, setSpecialisations] = useState(initial.specialisations);
  const [bio, setBio] = useState(initial.bio);
  const [experience, setExperience] = useState(initial.experience);
  const [recognition, setRecognition] = useState(programs[0]?.name || "");
  const [year, setYear] = useState(String(programs[0]?.year || new Date().getFullYear()));
  const [profileId, setProfileId] = useState(
    () =>
      `IBEN-${programs[0]?.year || new Date().getFullYear()}-${Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase()}`,
  );
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [image, setImage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    const body = new FormData();
    body.set("file", file);
    body.set("folder", slug || "professional");
    const res = await fetch("/api/admin/uploads", { method: "POST", body });
    const json = await res.json();
    return json.ok ? json.url : null;
  };

  const onHeadshot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    const url = await uploadFile(file);
    setImageUploading(false);
    if (url) setImage(url);
    else setError("Headshot upload failed.");
  };

  const addPortfolioFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const index = portfolio.length;
    setPortfolio((p) => [...p, { image: "", caption: "", uploading: true }]);
    const url = await uploadFile(file);
    setPortfolio((p) =>
      p.map((item, i) =>
        i === index ? { image: url || "", caption: item.caption, uploading: false } : item,
      ),
    );
    if (!url) setError("A portfolio image failed to upload.");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!image) {
      setError("Upload a headshot before publishing.");
      return;
    }
    setPending(true);
    const res = await fetch("/api/admin/professionals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        name,
        city,
        state,
        category,
        specialisations: specialisations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        recognition,
        year: Number(year),
        profileId,
        image,
        bio,
        experience,
        portfolio: portfolio
          .filter((p) => p.image)
          .map(({ image, caption }) => ({ image, caption })),
        status,
        submissionId,
      }),
    });
    setPending(false);
    if (res.ok) {
      router.push(`/professionals/${slug}`);
      router.refresh();
    } else {
      const json = await res.json().catch(() => null);
      setError(
        json?.code === "duplicate"
          ? "That slug or profile ID is already in use."
          : "Could not publish this record.",
      );
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
      <label className="field">
        <span>Slug (URL)</span>
        <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} required />
      </label>
      <div className="form-grid">
        <label className="field">
          <span>City</span>
          <input value={city} onChange={(e) => setCity(e.target.value)} required />
        </label>
        <label className="field">
          <span>State</span>
          <input value={state} onChange={(e) => setState(e.target.value)} required />
        </label>
      </div>
      <label className="field">
        <span>Category</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c.slug} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Specialisations (comma separated)</span>
        <input value={specialisations} onChange={(e) => setSpecialisations(e.target.value)} />
      </label>
      <label className="field">
        <span>Bio</span>
        <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} required />
      </label>
      <label className="field">
        <span>Experience</span>
        <textarea
          rows={2}
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          required
        />
      </label>
      <div className="form-grid">
        <label className="field">
          <span>Recognition programme</span>
          <input value={recognition} onChange={(e) => setRecognition(e.target.value)} required />
        </label>
        <label className="field">
          <span>Year</span>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </label>
      </div>
      <label className="field">
        <span>Profile ID</span>
        <input value={profileId} onChange={(e) => setProfileId(e.target.value)} required />
      </label>

      <label className="field">
        <span>Headshot</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onHeadshot} />
      </label>
      {imageUploading && <p style={{ fontSize: 12 }}>Uploading headshot...</p>}
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="Headshot preview" width={120} height={150} style={{ objectFit: "cover" }} />
      )}

      <div>
        <p style={{ fontSize: 13, marginBottom: 8 }}>Portfolio images</p>
        <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {portfolio.map((item, i) => (
            <li key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {item.uploading ? (
                <span style={{ fontSize: 12 }}>Uploading...</span>
              ) : item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" width={64} height={64} style={{ objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 12, color: "var(--muted)" }}>Failed</span>
              )}
              <input
                placeholder="Caption"
                value={item.caption}
                onChange={(e) =>
                  setPortfolio((p) =>
                    p.map((x, xi) => (xi === i ? { ...x, caption: e.target.value } : x)),
                  )
                }
              />
              <button
                type="button"
                onClick={() => setPortfolio((p) => p.filter((_, xi) => xi !== i))}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={addPortfolioFile}
          style={{ marginTop: 10 }}
        />
      </div>

      <label className="field">
        <span>Publish status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")}>
          <option value="draft">Draft (not visible on the site yet)</option>
          <option value="published">Published (live immediately)</option>
        </select>
      </label>

      {error && (
        <p role="alert" className="status-message error">
          {error}
        </p>
      )}
      <button type="submit" className="button button-dark" disabled={pending || imageUploading}>
        {pending ? "Saving..." : "Save professional"}
      </button>
    </form>
  );
}
