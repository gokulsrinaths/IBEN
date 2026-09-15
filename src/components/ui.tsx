import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  Scissors,
  Palette,
  Paintbrush,
  Flower2,
  Gem,
  Sun,
  Eye,
  Sparkles,
  CircleCheck,
  Search,
} from "lucide-react";
import {
  categories,
  stages,
  organization,
  news,
  type Professional,
  type News,
} from "@/lib/data";
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`container ${className}`}>{children}</div>;
}
export function Button({
  href,
  children,
  light = false,
  outline = false,
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
  outline?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`button ${outline ? "button-outline" : light ? "button-light" : "button-dark"}`}
    >
      {children}
      <ArrowUpRight size={16} />
    </Link>
  );
}
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <ArrowUpRight size={16} />
    </Link>
  );
}
export function SectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <p className="muted">{children}</p>}
    </div>
  );
}
export function Breadcrumbs({ title }: { title: string }) {
  return (
    <>
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>{title}</span>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: organization.url,
              },
              { "@type": "ListItem", position: 2, name: title },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
export function EditorialHero({
  eyebrow,
  title,
  description,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <section className={`page-hero ${compact ? "page-hero-compact" : ""}`}>
      <Container>
        <Breadcrumbs title={eyebrow} />
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
      </Container>
    </section>
  );
}
const icons = {
  scissors: Scissors,
  palette: Palette,
  brush: Paintbrush,
  flower: Flower2,
  gem: Gem,
  sun: Sun,
  eye: Eye,
  sparkles: Sparkles,
};
export function CategoryCard({
  category,
  index,
}: {
  category: (typeof categories)[number];
  index: number;
}) {
  const Icon = icons[category.icon as keyof typeof icons];
  return (
    <Link href={`/apply?category=${category.slug}`} className="category-card">
      <div className="category-top">
        <Icon size={26} strokeWidth={1.2} />
        <span>0{index + 1}</span>
      </div>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <ArrowUpRight className="category-arrow" size={18} />
    </Link>
  );
}
export function ProcessTimeline({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className={`process ${detailed ? "process-detailed" : ""}`}>
      {stages.map(([title, description], i) => (
        <li key={title}>
          <span className="process-number">0{i + 1}</span>
          <h3>{title}</h3>
          {detailed && <p>{description}</p>}
        </li>
      ))}
    </ol>
  );
}
export function FAQAccordion({ items }: { items: string[][] }) {
  return (
    <div className="faq-list">
      {items.map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Search size={24} strokeWidth={1.3} />
      </span>

      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
export function RecognitionBadge() {
  return (
    <div className="recognition-badge">
      <span>IBEN</span>
      <strong>
        TOP <i>50</i>
      </strong>
      <div>BEAUTY PROFESSIONALS</div>
      <span className="badge-year">
        20 <span>✦</span> 26
      </span>
    </div>
  );
}
export function RecognitionCard() {
  return (
    <section className="recognition-feature">
      <div className="recognition-art">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <RecognitionBadge />
        <span className="art-caption">
          EXCEPTIONAL CRAFT. DESERVED RECOGNITION.
        </span>
      </div>
      <div className="recognition-copy">
        <p className="eyebrow">
          THE FLAGSHIP INITIATIVE <span className="tiny-tag">2026 EDITION</span>
        </p>
        <h2>
          Distinctive talent.
          <br />
          <em>Meaningful recognition.</em>
        </h2>
        <p>
          Introducing IBEN Top 50 Beauty Professionals 2026 — a recognition
          initiative designed to identify and highlight outstanding
          professionals across India’s beauty industry.
        </p>
        <p>Guided by defined criteria. Grounded in the quality of the work.</p>
        <div className="button-row">
          <Button href="/top-50">Explore IBEN Top 50</Button>
          <TextLink href="/selection-process">Selection process</TextLink>
        </div>
      </div>
    </section>
  );
}
export function CTASection() {
  return (
    <section className="cta-section">
      <Container className="cta-inner">
        <div>
          <p className="eyebrow">THE NEXT CHAPTER STARTS WITH YOUR CRAFT</p>
          <h2>
            Your work deserves
            <br />
            to be <em>seen.</em>
          </h2>
          <p>
            Put your work forward, or nominate a professional
            <br className="desktop-only" /> whose craft deserves recognition.
          </p>
        </div>
        <div className="cta-actions">
          <Button href="/apply" light>
            Apply for Recognition
          </Button>
          <Button href="/nominate" outline>
            Nominate a Professional
          </Button>
          <span>Every application is subject to review.</span>
        </div>
      </Container>
    </section>
  );
}
export function VerificationRecord({
  professional: p,
}: {
  professional: Professional;
}) {
  return (
    <aside className="verification">
      <CircleCheck size={24} />
      <h3>IBEN Recognition Record</h3>
      <dl>
        <dt>Record ID</dt>
        <dd>{p.profileId}</dd>
        <dt>Recognition</dt>
        <dd>{p.recognition}</dd>
        <dt>Year</dt>
        <dd>{p.year}</dd>
      </dl>
      <p>
        This record confirms only recognition held in IBEN’s own database. It
        does not verify licensing, government approval or legal eligibility to
        practise.
      </p>
    </aside>
  );
}
export function ProfessionalCard({
  professional: p,
}: {
  professional: Professional;
}) {
  return (
    <Link href={`/professionals/${p.slug}`} className="professional-card">
      <Image src={p.image} alt={p.name} width={480} height={560} />
      <p className="eyebrow">
        {p.recognition} · {p.year}
      </p>
      <h3>{p.name}</h3>
      <p>
        {p.city} · {p.category}
      </p>
      <small>{p.profileId}</small>
    </Link>
  );
}
export function NewsCard({ item }: { item: News }) {
  return (
    <Link className="news-card" href={`/news/${item.slug}`}>
      <p className="eyebrow">
        {item.category} · {item.date}
      </p>
      <h2>{item.title}</h2>
      <p>{item.excerpt}</p>
      <ArrowRight size={20} />
    </Link>
  );
}
export function Footer() {
  const groups = [
    {
      title: "Organization",
      links: [
        ["About IBEN", "/about"],
        ["Our principles", "/standards"],
        ["Contact", "/contact"],
      ],
    },
    {
      title: "Recognition",
      links: [
        ["IBEN Top 50", "/top-50"],
        ["Selection process", "/selection-process"],
        ["Apply for recognition", "/apply"],
        ["Nominate a professional", "/nominate"],
      ],
    },
    {
      title: "Professionals",
      links: [
        ["Professional directory", "/professionals"],
        ["Categories", "/categories"],
      ],
    },
    {
      title: "Resources",
      links: [
        ...(news.length ? [["News & updates", "/news"]] : []),
        ["FAQs", "/faq"],
      ],
    },
    {
      title: "Legal",
      links: [
        ["Privacy policy", "/privacy"],
        ["Terms of use", "/terms"],
      ],
    },
  ];
  return (
    <footer className="footer">
      <Container>
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="wordmark">
              IBEN
            </Link>
            <p>{organization.name}</p>
            <span>
              Recognising excellence.
              <br />
              Celebrating the craft.
            </span>
          </div>
          {groups.map((g) => (
            <div key={g.title} className="footer-group">
              <h2>{g.title}</h2>
              {g.links.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {organization.name}.
          </span>
          <span>Excellence is in the details.</span>
          {organization.socials.map((s) => (
            <a key={s.url} href={s.url} rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}
