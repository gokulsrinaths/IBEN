import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { pages, standards } from "@/lib/pages";
import {
  categories,
  criteria,
  faqs,
  organization,
  programs,
  news,
} from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import {
  Container,
  EditorialHero,
  SectionHeader,
  CategoryCard,
  RecognitionCard,
  RecognitionBadge,
  CTASection,
  ProcessTimeline,
  FAQAccordion,
  Button,
  TextLink,
} from "@/components/ui";
import {
  ApplicationForm,
  NominationForm,
  ContactForm,
} from "@/components/forms";
import { ProfessionalDirectory, NewsDirectory } from "@/components/directory";
import { getPublishedProfessionals } from "@/lib/professionals-repository";
type Props = {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ category?: string }>;
};
export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}
// The "professionals" page reads live Supabase data; the publish/unpublish
// admin routes call revalidatePath("/professionals") for instant updates,
// this is just a safety-net window for any change made outside that flow.
export const revalidate = 300;
export async function generateMetadata({ params }: Props) {
  const { page } = await params;
  const p = pages[page];
  return p
    ? {
        ...pageMetadata(p.seoTitle || p.eyebrow, p.description, `/${page}`),
        ...(page === "news" && !news.length
          ? { robots: { index: false, follow: true } }
          : {}),
      }
    : {};
}
function Criteria() {
  return (
    <div className="criteria-list">
      {criteria.map(([t, d], i) => (
        <div className="criteria-item" key={t}>
          <span>0{i + 1}</span>
          <div>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
function Content({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className="content-section">
      <Container className={className}>{children}</Container>
    </section>
  );
}
export default async function ContentPage({ params, searchParams }: Props) {
  const { page } = await params;
  const p = pages[page];
  if (!p) notFound();
  const compact = [
    "apply",
    "nominate",
    "contact",
    "professionals",
    "faq",
  ].includes(page);
  let content: React.ReactNode;
  switch (page) {
    case "about":
      content = (
        <>
          <Content className="content-grid">
            <SectionHeader
              eyebrow="WHAT IS IBEN?"
              title="Recognition rooted in the work."
            />
            <div className="prose">
              <p>{organization.description}</p>
              <p>
                Our focus is the individual professional: the technical ability,
                creative judgement and consistent care behind their work.
                Through recognition initiatives, IBEN aims to make that
                contribution easier to discover and understand.
              </p>
              <p>
                IBEN is a professional recognition network. Its recognition is
                not a professional licence, government approval or
                accreditation.
              </p>
            </div>
          </Content>
          <Content>
            <div className="about-illustration-grid">
              <Image
                src="/images/about-illustration.jpg"
                alt="Illustration of a hairstylist combing a client's hair"
                width={720}
                height={480}
                className="about-illustration"
              />
              <div>
                <p className="eyebrow">CONSIDERED, NOT ASSUMED</p>
                <p className="about-quote">
                  Every recognition begins with a close look at the work
                  itself — technique, consistency and care, examined the way
                  a professional would examine it.
                </p>
              </div>
            </div>
          </Content>
          <Content>
            <div className="info-grid">
              {[
                [
                  "Our mission",
                  "To identify, recognise and celebrate exceptional beauty professionals through a considered assessment of their work.",
                ],
                [
                  "Our vision",
                  "A beauty industry in which skilled, responsible practice is visible, valued and understood.",
                ],
                [
                  "Why recognition matters",
                  "Thoughtful recognition gives professional craft context. It helps people discover the individual behind the work and understand what has been assessed.",
                ],
                [
                  "What we look for",
                  "Technical skill, authentic portfolios, consistency, depth of specialisation and professional integrity.",
                ],
              ].map(([t, d]) => (
                <div className="info-card" key={t}>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </Content>
          <Content className="content-grid">
            <SectionHeader
              eyebrow="OUR PRINCIPLES"
              title="The standard we hold ourselves to."
            />
            <div>
              <div className="inline-links">
                {[
                  "Excellence",
                  "Integrity",
                  "Professionalism",
                  "Craft",
                  "Fair Evaluation",
                ].map((t) => (
                  <Link key={t} href="/standards">
                    {t}
                  </Link>
                ))}
              </div>
              <p className="notice">
                Clear criteria and truthful representation are central to a
                meaningful recognition process.
              </p>
              <TextLink href="/standards">Read our standards & ethics</TextLink>
            </div>
          </Content>
          <Content className="content-grid">
            <SectionHeader
              eyebrow="LEADERSHIP"
              title="The people guiding IBEN."
            />
            <div>
              {organization.leadership.length ? (
                organization.leadership.map((l) => (
                  <article className="info-card" key={l.name}>
                    <h3>{l.name}</h3>
                    <p>{l.role}</p>
                    <p>{l.bio}</p>
                  </article>
                ))
              ) : (
                <div className="notice">
                  <strong>Leadership details — pending publication.</strong>
                  <br />
                  Verified names, roles and biographies have not yet been
                  published. They will be added here once confirmed.
                </div>
              )}
              <TextLink href="/contact">Contact the network</TextLink>
            </div>
          </Content>
          <CTASection />
        </>
      );
      break;
    case "recognition":
      content = (
        <>
          <Content>
            <RecognitionCard />
          </Content>
          <Content className="content-grid">
            <SectionHeader
              eyebrow="A FRAMEWORK FOR RECOGNITION"
              title="Specific programmes. Shared principles."
            />
            <div className="prose">
              <p>
                Each IBEN initiative has its own scope, recognition year and
                selection process. The current flagship programme is{" "}
                {programs[0].name} {programs[0].year}. Further initiatives will
                be listed here when confirmed.
              </p>
              <p>
                Recognition highlights work considered through an IBEN
                assessment. It does not imply universal ranking, licensing or
                guaranteed future performance.
              </p>
              <div className="notice">
                Recognition is not guaranteed by application, nomination,
                payment, membership, or participation.
              </div>
              <TextLink href="/selection-process">
                Understand the selection process
              </TextLink>
            </div>
          </Content>
          <CTASection />
        </>
      );
      break;
    case "top-50":
      content = (
        <>
          <Content className="top50-intro">
            <div className="recognition-art">
              <Image
                src="/images/top50-badge.png"
                alt=""
                width={420}
                height={420}
                className="recognition-illustration"
              />
              <RecognitionBadge />
            </div>
            <div>
              <p className="eyebrow">IBEN TOP 50 · 2026</p>
              <h2>
                Distinctive work.
                <br />
                <em>A meaningful spotlight.</em>
              </h2>
              <p>
                The initiative is designed to highlight outstanding
                professionals across beauty disciplines, considering the craft,
                consistency and professional practice behind their work.
              </p>
              <p>
                The Top 50 identity describes this initiative. It is not a claim
                to rank all beauty professionals in India.
              </p>
              <div className="button-row">
                <Button href="/apply">Prepare an application</Button>
                <TextLink href="/nominate">Nominate a professional</TextLink>
              </div>
            </div>
          </Content>
          <Content className="content-grid">
            <SectionHeader
              eyebrow="WHO CAN TAKE PART"
              title="Your practice is what matters."
            />
            <div className="prose">
              <p>
                Salon professionals, independent and freelance practitioners,
                and salon owners who actively practise a beauty discipline in
                India may put their work forward.
              </p>
              <p>
                Provide your professional details, a relevant category and a
                portfolio that shows your own contribution. Any additional
                requirements or intake dates will be published before
                submissions open.
              </p>
              <div className="notice">
                <strong>2026 intake details are pending confirmation.</strong>{" "}
                No application deadline, fee or selection date has been
                published.
              </div>
            </div>
          </Content>
          <Content>
            <SectionHeader
              eyebrow="THE DISCIPLINES"
              title="Excellence across beauty."
            />
            <div className="inline-links" style={{ marginTop: 25 }}>
              {categories.map((c) => (
                <Link key={c.slug} href={`/apply?category=${c.slug}`}>
                  {c.name}
                </Link>
              ))}
            </div>
          </Content>
          <Content className="content-grid">
            <SectionHeader
              eyebrow="WHAT IS EVALUATED"
              title="More than a single image."
            />
            <Criteria />
          </Content>
          <Content>
            <SectionHeader
              eyebrow="HOW IT WORKS"
              title="The path to recognition."
            />
            <div style={{ marginTop: 40 }}>
              <ProcessTimeline detailed />
            </div>
            <p className="notice">
              Recognition is not guaranteed by application, nomination, payment,
              membership, or participation.
            </p>
            <TextLink href="/selection-process">
              Read the complete methodology
            </TextLink>
          </Content>
          <Content className="content-grid">
            <SectionHeader
              eyebrow="BEFORE YOU APPLY"
              title="A little more clarity."
            />
            <FAQAccordion items={[faqs[1], faqs[4], faqs[6], faqs[11]]} />
          </Content>
          <CTASection />
        </>
      );
      break;
    case "selection-process":
      content = (
        <>
          <Content className="content-grid">
            <SectionHeader
              eyebrow="THE APPROACH"
              title="The work comes first."
            />
            <div className="prose">
              <p>
                IBEN’s methodology is designed to assess the evidence a
                professional provides within their chosen category. Different
                disciplines need different context; no single visual style or
                social audience defines excellence.
              </p>
              <p>
                The framework below describes the intended assessment process.
                Programme-specific intake dates, reviewer details and any
                additional requirements will be published when confirmed.
              </p>
              <div className="notice">
                <strong>
                  Recognition is not guaranteed by application, nomination,
                  payment, membership, or participation.
                </strong>
              </div>
            </div>
          </Content>
          <Content className="content-grid">
            <SectionHeader
              eyebrow="EVALUATION CRITERIA"
              title="What we look for."
            />
            <Criteria />
          </Content>
          <Content>
            <SectionHeader
              eyebrow="SIX CONSIDERED STAGES"
              title="From introduction to recognition."
            />
            <div style={{ marginTop: 40 }}>
              <ProcessTimeline detailed />
            </div>
          </Content>
          <Content>
            <div className="info-grid">
              <div className="info-card">
                <h3>Portfolio authenticity</h3>
                <p>
                  Applicants should identify their own contribution, obtain
                  image permissions and disclose material retouching or
                  generated imagery. Original files, additional context or
                  evidence of authorship may be requested. An image alone is not
                  proof of professional work.
                </p>
              </div>
              <div className="info-card">
                <h3>Conflicts of interest</h3>
                <p>
                  Relevant personal, financial and professional relationships
                  should be disclosed. Reviewers with a material conflict should
                  step aside from the affected assessment. Selection should
                  follow documented evidence and the programme criteria.
                </p>
              </div>
              <div className="info-card">
                <h3>Professional evaluation</h3>
                <p>
                  A conversation or further information may be requested to
                  clarify experience, technique or portfolio context. Not every
                  applicant will progress to every stage. A request for more
                  information is not a selection decision.
                </p>
              </div>
              <div className="info-card">
                <h3>Final review & corrections</h3>
                <p>
                  Final review considers the complete assessment before
                  recognition is issued. Concerns about accuracy, authenticity
                  or a published record can be raised through professional
                  support with relevant evidence.
                </p>
              </div>
            </div>
            <div className="button-row" style={{ marginTop: 30 }}>
              <TextLink href="/standards">Standards & ethics</TextLink>
              <TextLink href="/contact">Raise an enquiry</TextLink>
            </div>
          </Content>
          <CTASection />
        </>
      );
      break;
    case "categories":
      content = (
        <>
          <Content>
            <div className="category-grid">
              {categories.map((c, i) => (
                <CategoryCard key={c.slug} category={c} index={i} />
              ))}
            </div>
            <div className="notice">
              Choose the category that best represents the work you are
              submitting. You can describe additional specialisations in your
              application. Category fit is reviewed during eligibility
              screening.
            </div>
          </Content>
          <CTASection />
        </>
      );
      break;
    case "professionals": {
      const publishedProfessionals = await getPublishedProfessionals();
      content = (
        <Content>
          <ProfessionalDirectory professionals={publishedProfessionals} />
        </Content>
      );
      break;
    }
    case "news":
      content = (
        <Content>
          <NewsDirectory />
        </Content>
      );
      break;
    case "apply": {
      const query = await searchParams;
      content = (
        <Content className="form-layout">
          <ApplicationForm
            initialCategory={
              typeof query.category === "string" ? query.category : ""
            }
          />
          <aside className="form-sidebar">
            <p className="eyebrow">YOUR APPLICATION</p>
            <h2>A considered introduction.</h2>
            <p>
              Set aside your contact details, professional experience and an
              accessible portfolio link. Choose examples that reflect the
              quality and consistency of your own work.
            </p>

            <TextLink href="/selection-process">How selection works</TextLink>
            <br />
            <TextLink href="/faq">Application questions</TextLink>
          </aside>
        </Content>
      );
      break;
    }
    case "nominate":
      content = (
        <Content className="form-layout">
          <NominationForm />
          <aside className="form-sidebar">
            <p className="eyebrow">A THOUGHTFUL RECOMMENDATION</p>
            <h2>Tell us what stands out.</h2>
            <p>
              Focus on the professional’s craft and the work you have seen.
              Share public portfolio links and only information you have
              permission to provide.
            </p>

            <TextLink href="/selection-process">
              Explore the methodology
            </TextLink>
          </aside>
        </Content>
      );
      break;
    case "contact":
      content = (
        <Content className="form-layout">
          <ContactForm />
          <aside className="form-sidebar">
            <h2>Enquiry guidance</h2>
            <p>
              Include the programme name or IBEN profile ID where relevant.
              Leave out identity documents, payment details and private client
              information.
            </p>
            <div className="contact-channels">
              {Object.entries(organization.emails).some(
                ([, email]) => email,
              ) ? (
                Object.entries(organization.emails)
                  .filter(([, email]) => email)
                  .map(([key, email]) => (
                    <div key={key}>
                      <h3>
                        {
                          {
                            general: "General enquiries",
                            recognition: "Recognition enquiries",
                            partnerships: "Partnership enquiries",
                            support: "Professional support",
                          }[key]
                        }
                      </h3>
                      <a className="text-link" href={`mailto:${email}`}>
                        {email}
                      </a>
                    </div>
                  ))
              ) : (
                <p className="notice">
                  Contact email addresses will be published once confirmed.
                </p>
              )}
              {organization.phone && (
                <div>
                  <h3>Phone</h3>
                  <a
                    className="text-link"
                    href={`tel:${organization.phone.replace(/\s+/g, "")}`}
                  >
                    {organization.phone}
                  </a>
                </div>
              )}
            </div>
          </aside>
        </Content>
      );
      break;
    case "faq":
      content = (
        <Content>
          <FAQAccordion items={faqs} />
          <div style={{ marginTop: 24 }}>
            <TextLink href="/contact">Contact information</TextLink>
          </div>
        </Content>
      );
      break;
    case "standards":
      content = (
        <Content className="content-grid">
          <div>
            <SectionHeader
              eyebrow="A SHARED COMMITMENT"
              title="Responsible recognition."
            />
            <p className="notice">
              These principles describe IBEN’s intended professional standards.
              They do not replace applicable law, licensing obligations or
              professional responsibilities.
            </p>
          </div>
          <div className="prose">
            {standards.map(([t, d]) => (
              <section key={t}>
                <h2>{t}</h2>
                <p>{d}</p>
              </section>
            ))}
            <TextLink href="/contact">
              Professional support & enquiries
            </TextLink>
          </div>
        </Content>
      );
      break;
    case "privacy":
      content = (
        <Content className="content-grid">
          <SectionHeader
            eyebrow="WEBSITE PRIVACY"
            title="What happens to your information."
          />
          <div className="prose">
            <div className="notice">
              <strong>Initial website notice.</strong> A full operational
              privacy policy, responsible entity details, contact address and
              retention schedule must be confirmed before live applications or
              enquiries are accepted.
            </div>
            <h2>Application, nomination and enquiry entries</h2>
            <p>
              The forms on this website keep your entries in the current page’s
              memory. They do not send form entries or selected portfolio files
              to IBEN. Reloading or leaving the page clears the entries. A
              submission availability check sends no form entries or images. No
              files are downloaded.
            </p>
            <h2>Portfolio images</h2>
            <p>
              Selected files are checked locally for format and size. Local
              previews are created in your browser and released when removed or
              when you leave the form. Share only work and client images you
              have permission to use.
            </p>
            <h2>Website delivery</h2>
            <p>
              Your browser requests pages and assets from the hosting provider.
              The provider may process technical information such as IP
              addresses and request logs to deliver and protect the site. This
              website does not include advertising, marketing trackers or an
              analytics integration.
            </p>
            <h2>Future submissions</h2>
            <p>
              Before live submission is enabled, this notice should explain who
              receives your data, the reasons for processing it, service
              providers, access controls, retention, relevant rights and how to
              request a correction or deletion. A nomination workflow should
              explain how nominee consent is obtained.
            </p>
            <h2>Contact and corrections</h2>
            <p>
              Verified privacy contact details are pending publication. Visit
              the contact page for currently configured channels. Avoid sharing
              sensitive personal information until an appropriate submission
              channel is available.
            </p>
            <TextLink href="/contact">Contact information</TextLink>
          </div>
        </Content>
      );
      break;
    case "terms":
      content = (
        <Content className="content-grid">
          <SectionHeader
            eyebrow="WEBSITE TERMS"
            title="The scope of this platform."
          />
          <div className="prose">
            <div className="notice">
              <strong>Initial website terms.</strong> The responsible operating
              entity and programme-specific terms are pending confirmation.
              These terms describe the scope of the current informational
              website and forms awaiting submission availability.
            </div>
            <h2>About this website</h2>
            <p>
              This website introduces India Beauty Excellence Network and its
              recognition framework. Confirmed programme details and published
              recognition records, when available, should be checked on the
              relevant programme and professional pages.
            </p>
            <h2>Meaning of recognition</h2>
            <p>
              Recognition relates only to the named individual, programme and
              year in an IBEN record. It is not a professional licence,
              regulatory approval, government endorsement or guarantee of future
              work. Applying, being nominated, paying, joining or participating
              does not guarantee recognition.
            </p>
            <h2>Applications and nominations</h2>
            <p>
              Submitting an application, nomination or enquiry does not
              create a shortlist position or guarantee recognition. Intake
              dates and any programme conditions will be confirmed and
              published as the 2026 selection process proceeds.
            </p>
            <h2>Accuracy and permitted use</h2>
            <p>
              Provide accurate information and share only material you own or
              have permission to use. Do not impersonate another professional,
              misuse a recognition identity or represent another person’s
              portfolio as your own.
            </p>
            <h2>Content and external links</h2>
            <p>
              IBEN branding and editorial content should not be reproduced in
              ways that imply an unconfirmed affiliation or recognition.
              Portfolio and professional links, when published, lead to
              third-party services with their own terms.
            </p>
            <h2>Corrections and concerns</h2>
            <p>
              Programme details and records may be corrected as verified
              information becomes available. Raise factual concerns through the
              published contact channels and include relevant supporting
              information. Review the standards page for the intended
              recognition correction process.
            </p>
            <TextLink href="/standards">Standards & ethics</TextLink>
          </div>
        </Content>
      );
      break;
    default:
      notFound();
  }
  return (
    <div className={compact ? "task-page" : undefined}>
      <EditorialHero {...p} compact={compact} />
      {content}
    </div>
  );
}
