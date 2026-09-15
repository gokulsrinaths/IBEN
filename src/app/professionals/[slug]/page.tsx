import Image from "next/image";
import { notFound } from "next/navigation";
import { professionals } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { Container, EditorialHero, VerificationRecord } from "@/components/ui";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return professionals.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = professionals.find((p) => p.slug === slug);
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
  const p = professionals.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <>
      <EditorialHero
        eyebrow={`${p.recognition} · ${p.year}`}
        title={p.name}
        description={`${p.city}, ${p.state} · ${p.category}`}
      />
      <section className="content-section">
        <Container className="profile-grid">
          <div>
            <Image
              src={p.image}
              alt={p.name}
              width={600}
              height={750}
              sizes="(max-width:767px) 100vw, 33vw"
            />
            <VerificationRecord professional={p} />
          </div>
          <div className="prose">
            <h2>About the professional</h2>
            <p>{p.bio}</p>
            <h2>Areas of expertise</h2>
            <ul>
              {p.specialisations.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <h2>Professional experience</h2>
            <p>{p.experience}</p>
            <h2>Selected portfolio</h2>
            {p.portfolio.length ? (
              <div className="info-grid">
                {p.portfolio.map((work) => (
                  <figure key={work.image}>
                    <Image
                      src={work.image}
                      alt={work.caption}
                      width={600}
                      height={700}
                      sizes="(max-width:767px) 100vw, 33vw"
                    />
                    <figcaption>{work.caption}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <p>A public portfolio has not been published for this record.</p>
            )}
            <h2>Recognition information</h2>
            <p>
              {p.name} is listed for {p.recognition}, {p.year}. The record
              identifies the recognition programme and individual; it does not
              endorse every service or verify a professional licence.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
