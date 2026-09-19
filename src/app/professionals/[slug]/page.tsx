import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedProfessionalBySlug } from "@/lib/professionals-repository";
import { pageMetadata } from "@/lib/seo";
import {
  Container,
  EditorialHero,
  VerificationRecord,
  ProfileStats,
  CTASection,
} from "@/components/ui";
import { ProfileGallery } from "@/components/gallery";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = true;
export const revalidate = 300;
export function generateStaticParams() {
  return [];
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = await getPublishedProfessionalBySlug(slug);
  return p
    ? pageMetadata(
        p.name,
        `${p.name} · ${p.category} · ${p.city}. ${p.recognition} ${p.year}. IBEN record ${p.profileId}.`,
        `/professionals/${slug}`,
      )
    : { title: "Record not found" };
}
export default async function Profile({ params }: Props) {
  const { slug } = await params;
  const p = await getPublishedProfessionalBySlug(slug);
  if (!p) notFound();
  return (
    <>
      <EditorialHero
        eyebrow={`${p.recognition} · ${p.year}`}
        title={p.name}
        description={`${p.city}, ${p.state} · ${p.category}`}
      />
      <div className="profile-hero-image">
        <Image
          src={p.image}
          alt={p.name}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <div className="profile-hero-badge">
          IBEN {p.recognition.replace(/^IBEN\s*/i, "")} · {p.year}
        </div>
      </div>
      <section className="content-section">
        <Container>
          <ProfileStats professional={p} />
        </Container>
      </section>
      <section className="content-section">
        <Container className="profile-grid">
          <div>
            <VerificationRecord professional={p} />
          </div>
          <div className="prose">
            <h2>About the professional</h2>
            <p>{p.bio}</p>
            <h2>Areas of expertise</h2>
            <div className="chip-list">
              {p.specialisations.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
            <h2>Professional experience</h2>
            <p>{p.experience}</p>
            <h2>Selected portfolio</h2>
            <ProfileGallery items={p.portfolio} />
            <h2>Recognition information</h2>
            <p>
              {p.name} is listed for {p.recognition}, {p.year}. The record
              identifies the recognition programme and individual; it does not
              endorse every service or verify a professional licence.
            </p>
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
