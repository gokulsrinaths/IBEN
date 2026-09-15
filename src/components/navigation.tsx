"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navigation, news } from "@/lib/data";
const visibleNavigation = navigation.filter(
  (item) => item.href !== "/news" || news.length > 0,
);
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="wordmark" aria-label="IBEN home">
          IBEN
          <span>
            INDIA BEAUTY
            <br />
            EXCELLENCE NETWORK
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {visibleNavigation.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={path === n.href ? "page" : undefined}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/apply" className="button button-dark header-cta">
            Apply for Recognition <ArrowUpRight size={15} />
          </Link>
          <Link href="/nominate" className="header-nomination">
            Nominate a Professional
          </Link>
        </div>
        <button
          className="menu-toggle"
          ref={toggle}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {[
            ...visibleNavigation,
            { label: "Apply for Recognition", href: "/apply" },
            { label: "Nominate a Professional", href: "/nominate" },
          ].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              aria-current={path === n.href ? "page" : undefined}
            >
              {n.label}
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
