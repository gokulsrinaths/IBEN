"use client";
import { useState } from "react";
import { categories, professionals, news, newsCategories } from "@/lib/data";
import { EmptyState, ProfessionalCard, NewsCard } from "./ui";
export function ProfessionalDirectory() {
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    state: "",
    category: "",
    specialisation: "",
    year: "",
  });
  const update = (name: string, value: string) =>
    setFilters((f) => ({ ...f, [name]: value }));
  const results = professionals.filter(
    (p) =>
      `${p.name} ${p.profileId}`
        .toLowerCase()
        .includes(filters.search.trim().toLowerCase()) &&
      (!filters.city || p.city === filters.city) &&
      (!filters.state || p.state === filters.state) &&
      (!filters.category || p.category === filters.category) &&
      (!filters.specialisation ||
        p.specialisations.includes(filters.specialisation)) &&
      (!filters.year || String(p.year) === filters.year),
  );
  const active = Object.values(filters).some(Boolean);
  const options = [
    ["city", "City", [...new Set(professionals.map((p) => p.city))].sort()],
    ["state", "State", [...new Set(professionals.map((p) => p.state))].sort()],
    ["category", "Category", categories.map((c) => c.name)],
    [
      "specialisation",
      "Specialisation",
      [...new Set(professionals.flatMap((p) => p.specialisations))].sort(),
    ],
    [
      "year",
      "Recognition year",
      [...new Set(professionals.map((p) => String(p.year)))].sort().reverse(),
    ],
  ] as const;
  if (!professionals.length)
    return (
      <EmptyState title="The first IBEN recognition records">
        <span>
          The first recognition records will be published after the 2026
          selection is complete. Each published profile will identify the
          professional, programme and recognition year.
        </span>
      </EmptyState>
    );
  return (
    <>
      <div className="directory-filters">
        <label className="field">
          Name or IBEN profile ID
          <input
            type="search"
            placeholder="Search professionals"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
          />
        </label>
        {options.map(([key, label, values]) => (
          <label key={key} className="field">
            {label}
            <select
              value={filters[key]}
              onChange={(e) => update(key, e.target.value)}
            >
              <option value="">
                {
                  {
                    city: "All cities",
                    state: "All states",
                    category: "All categories",
                    specialisation: "All specialisations",
                    year: "All recognition years",
                  }[key]
                }
              </option>
              {values.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="directory-count">
        <span aria-live="polite">
          {results.length} published professional
          {results.length === 1 ? "" : "s"}
          {active ? " matching your filters" : ""}
        </span>
        {active && (
          <button
            className="reset-button"
            onClick={() =>
              setFilters({
                search: "",
                city: "",
                state: "",
                category: "",
                specialisation: "",
                year: "",
              })
            }
          >
            Clear filters
          </button>
        )}
      </div>
      {results.length ? (
        <div className="professional-grid">
          {results.map((p) => (
            <ProfessionalCard key={p.slug} professional={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            active ? "No matching records." : "Recognition takes consideration."
          }
        >
          {active
            ? "Try another name or adjust your filters. Only published IBEN records appear in this directory."
            : "2026 recognised professionals will be announced following the completion of the selection process. No recognition records have been published yet."}
        </EmptyState>
      )}
      <p className="notice">
        A directory entry confirms only an IBEN recognition record. It is not a
        professional licence or government verification. Match the profile ID,
        programme and year when checking a claim.
      </p>
    </>
  );
}
export function NewsDirectory() {
  const [category, setCategory] = useState("All updates");
  const filtered = news.filter(
    (n) => category === "All updates" || n.category === category,
  );
  if (!news.length)
    return (
      <EmptyState title="No updates published yet.">
        Confirmed programme announcements will appear here when available.
      </EmptyState>
    );
  return (
    <>
      <div className="news-tabs" aria-label="Filter news">
        {["All updates", ...newsCategories].map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="info-grid">
          {filtered.map((n) => (
            <NewsCard key={n.slug} item={n} />
          ))}
        </div>
      ) : (
        <div aria-live="polite">
          <EmptyState
            title={
              category === "All updates"
                ? "The next chapter, in time."
                : `No updates in ${category.toLowerCase()} yet.`
            }
          >
            Confirmed programme announcements, network updates and professional
            stories will appear here. There are no published updates at this
            time.
          </EmptyState>
        </div>
      )}
    </>
  );
}
