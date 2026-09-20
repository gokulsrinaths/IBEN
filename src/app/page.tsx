import Image from "next/image";
import { ArrowDown } from "lucide-react";
import {
  Container,
  Button,
  TextLink,
  SectionHeader,
  CategoryCard,
  ProcessTimeline,
  RecognitionCard,
  CTASection,
  EmptyState,
} from "@/components/ui";
import { categories, organization } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { ApplyPopup } from "@/components/apply-popup";
export const metadata = pageMetadata(
  "Recognising Excellence in Indian Beauty",
  organization.description,
  "/",
);
export default function Home() {
  return (
    <>
      <ApplyPopup />
      <section className="home-hero">
        <Container>
          <div className="hero-overline">
            <span className="eyebrow">INDIA BEAUTY EXCELLENCE NETWORK</span>
            <span className="edition">CRAFT. CHARACTER. EXCELLENCE.</span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <h1>
                Recognising
                <br />
                Excellence in
                <br />
                <em>Indian Beauty.</em>
              </h1>
              <p>{organization.description}</p>
              <div className="button-row">
                <Button href="/about">Explore IBEN</Button>
                <TextLink href="/apply">Apply for Recognition</TextLink>
              </div>
              <div className="hero-footnote">
                <span className="small-line" /> FOR THE PROFESSIONALS BEHIND THE
                CRAFT
              </div>
            </div>
            <div className="hero-visual hero-visual--illustrated">
              <Image
                src="/images/hero-illustration.jpg"
                alt="Illustration of a woman styling her hair, in IBEN's brand colours"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 50vw"
              />
              <div className="image-shade" />
              <div className="image-label">
                <span>THE ART OF EXCELLENCE</span>
                <p>
                  Behind every detail,
                  <br />a dedicated professional.
                </p>
              </div>
              <span className="image-index">01 / THE CRAFT</span>
              <div className="hero-stamp">
                IBEN
                <span>
                  RECOGNISING
                  <br />
                  EXCELLENCE
                </span>
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <span>Professional recognition across beauty disciplines.</span>
            <a href="#discover">
              DISCOVER THE NETWORK <ArrowDown size={14} />
            </a>
          </div>
        </Container>
      </section>
      <section id="discover" className="section intro">
        <Container className="intro-grid">
          <p className="eyebrow">THE PURPOSE BEHIND IBEN</p>
          <div>
            <h2>
              Celebrating the professionals
              <br />
              behind <em>the craft.</em>
            </h2>
            <div className="intro-body">
              <p>
                Beauty is shaped by skilled hands, creative vision and years of
                dedication. The professionals behind it deserve to be seen for
                the quality of their work.
              </p>
              <div>
                <p>
                  IBEN exists to highlight professional excellence across
                  India’s diverse beauty industry — bringing considered
                  recognition to the craft, care and commitment that make a
                  difference.
                </p>
                <TextLink href="/about">Get to know IBEN</TextLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <Container>
        <RecognitionCard />
      </Container>
      <section className="section">
        <Container>
          <div className="section-top">
            <SectionHeader
              eyebrow="MANY DISCIPLINES. ONE STANDARD OF EXCELLENCE."
              title="Every craft has its place."
            >
              Recognising the depth and diversity of professional beauty.
            </SectionHeader>
            <TextLink href="/categories">Explore all categories</TextLink>
          </div>
          <div className="category-grid">
            {categories.map((c, i) => (
              <CategoryCard category={c} index={i} key={c.slug} />
            ))}
          </div>
        </Container>
      </section>
      <section className="section process-section">
        <Container>
          <div className="section-top">
            <SectionHeader
              eyebrow="A CONSIDERED PATH TO RECOGNITION"
              title="Excellence, thoughtfully evaluated."
            >
              A clear process that puts your work at the centre.
            </SectionHeader>
            <TextLink href="/selection-process">
              View our selection methodology
            </TextLink>
          </div>
          <ProcessTimeline />
          <p className="process-note">
            Recognition is earned through review. Application or nomination does
            not guarantee selection.
          </p>
        </Container>
      </section>
      <section className="section">
        <Container>
          <div className="section-top">
            <SectionHeader
              eyebrow="THE PEOPLE BEHIND THE RECOGNITION"
              title="Exceptional work. Individual stories."
            />
            <TextLink href="/professionals">Explore professionals</TextLink>
          </div>
          <EmptyState title="2026 recognition records">
            2026 recognised professionals will be announced following the
            completion of the selection process.
          </EmptyState>
        </Container>
      </section>
      <section className="section values-section">
        <Container>
          <div className="section-top">
            <SectionHeader
              eyebrow="WHAT WE STAND FOR"
              title="Recognition with purpose."
            />
            <p className="section-aside">
              Credibility begins with clarity.
              <br />
              These principles guide the work of IBEN.
            </p>
          </div>
          <div className="values-grid">
            {[
              [
                "Professional Excellence",
                "Recognising skill, consistency and the dedication behind high-quality work.",
              ],
              [
                "Transparent Evaluation",
                "Clear criteria and a considered process, with integrity at every stage.",
              ],
              [
                "Recognition of Craft",
                "Making space for distinct disciplines, specialisations and creative perspectives.",
              ],
              [
                "Professional Community",
                "Creating a shared place for professionals who care about their craft.",
              ],
            ].map(([t, d], i) => (
              <div key={t}>
                <span className="eyebrow">0{i + 1} /</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
