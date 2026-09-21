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
                Provide your professional details and information about your
                work. Additional portfolio examples or information may be
                requested during the review process.
              </p>
              <div className="notice">
                <strong>2026 applications are now open.</strong> Beauty
                professionals in Chennai can currently submit their details
                for consideration. Applications are reviewed according to the
                IBEN evaluation process.
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
                The framework below describes the assessment process
                professionals go through once they apply. Additional context,
                reviewer conversations or portfolio material may be requested
                as part of that review.
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
              This is the official IBEN application form. Set aside your
              contact details, professional experience and a few portfolio
              images that reflect the quality and consistency of your own
              work. IBEN may request additional portfolio material or
              information during review.
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
            eyebrow="PRIVACY POLICY"
            title="Your information, handled with care."
          />
          <div className="prose">
            <p>
              <em>Last updated: 21 September 2026</em>
            </p>
            <p>
              India Beauty Excellence Network (“IBEN”, “we”, “us” or “our”)
              respects your privacy. This Privacy Policy explains how we
              collect, use and protect information submitted through our
              website, Meta lead forms, WhatsApp and other IBEN application or
              communication channels.
            </p>
            <h2>Information we collect</h2>
            <p>
              When you apply for an IBEN recognition initiative, nominate a
              professional, contact us, or otherwise interact with IBEN, we
              may collect information such as:
            </p>
            <ul>
              <li>Name and contact information, including phone or WhatsApp number</li>
              <li>City, location and professional experience</li>
              <li>Beauty services and specialisations</li>
              <li>Training and professional background</li>
              <li>Brands or products used professionally</li>
              <li>Instagram or other professional profile information</li>
              <li>Portfolio or work images that you choose to share</li>
              <li>Information you provide during calls, messages, applications or enquiries</li>
            </ul>
            <h2>How we use your information</h2>
            <p>We may use this information to:</p>
            <ul>
              <li>Review applications for IBEN recognition programmes, including the IBEN Top 50 Beauty Professionals</li>
              <li>Assess professional experience, services and submitted or publicly available professional work</li>
              <li>Contact applicants about their application or the next stage of the review process</li>
              <li>Request additional information or portfolio examples when necessary</li>
              <li>Manage nominations and enquiries</li>
              <li>Maintain records relating to IBEN applications, selections and professional recognition</li>
              <li>Improve IBEN programmes and communications</li>
            </ul>
            <p>
              Submitting an application does not guarantee selection or
              recognition.
            </p>
            <h2>Meta and Instagram Lead Forms</h2>
            <p>
              IBEN may collect application information through lead forms
              provided by Meta platforms such as Facebook and Instagram.
            </p>
            <p>
              Information submitted through these forms is provided to IBEN
              and may also be processed by Meta according to Meta’s own
              privacy policies.
            </p>
            <p>
              Where available, IBEN may review professional or public profile
              information associated with an applicant’s social media
              presence as part of the application review process.
            </p>
            <h2>WhatsApp and communications</h2>
            <p>
              If you provide a WhatsApp number or consent to communication
              through WhatsApp, IBEN may contact you regarding your
              application, recognition process, portfolio, enquiries or
              related IBEN activities.
            </p>
            <p>You may ask us to stop non-essential communications at any time.</p>
            <h2>Portfolio and professional work</h2>
            <p>
              Applicants may voluntarily provide portfolio images, links or
              other examples of their professional work.
            </p>
            <p>
              Please only share photographs or other materials that you have
              permission to share. IBEN may use submitted portfolio material
              for application assessment and verification. We will seek
              appropriate permission before using submitted work publicly for
              promotional or recognition purposes where required.
            </p>
            <h2>How we protect and retain information</h2>
            <p>
              IBEN takes reasonable measures to protect personal information
              from unauthorised access, misuse or disclosure.
            </p>
            <p>
              Information will be retained only for as long as reasonably
              necessary for the purposes described in this policy, including
              application review, record keeping and legitimate
              organisational requirements.
            </p>
            <h2>Sharing of information</h2>
            <p>IBEN does not sell applicants’ personal information.</p>
            <p>
              Information may be accessed by authorised IBEN team members and
              service providers where necessary to operate our website,
              application systems, communications or recognition programmes.
              Information may also be disclosed where required by law.
            </p>
            <h2>Your choices</h2>
            <p>
              You may contact IBEN to request access to, correction of, or
              deletion of personal information you have provided, subject to
              applicable legal and operational requirements.
            </p>
            <p>You may also ask IBEN to stop sending non-essential communications.</p>
            <h2>Third-party services</h2>
            <p>
              IBEN may use third-party services such as Meta, Instagram,
              WhatsApp and website hosting or technology providers. These
              services may process information according to their own privacy
              policies and terms.
            </p>
            <h2>Contact</h2>
            <p>
              For privacy questions, corrections or deletion requests,
              contact:
            </p>
            <p>
              <strong>India Beauty Excellence Network (IBEN)</strong>
              <br />
              Website: <a href="https://www.joiniben.in">www.joiniben.in</a>
              <br />
              Contact: <TextLink href="/contact">www.joiniben.in/contact</TextLink>
              <br />
              Email:{" "}
              <a href="mailto:indiabeautyexcellencenetwork@gmail.com">
                indiabeautyexcellencenetwork@gmail.com
              </a>
            </p>
            <h2>Updates to this policy</h2>
            <p>
              We may update this Privacy Policy as IBEN’s services and
              programmes develop. The latest version will be published on
              this page with an updated revision date.
            </p>
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
              <strong>These terms describe the scope of this website and its
              application forms.</strong> They apply alongside the Privacy
              Policy and the Standards &amp; Ethics page.
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
