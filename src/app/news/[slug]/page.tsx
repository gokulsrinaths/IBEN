import { notFound } from "next/navigation";
import { news } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { Container, EditorialHero, TextLink } from "@/components/ui";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const n = news.find((n) => n.slug === slug);
  return n
    ? pageMetadata(n.title, n.excerpt, `/news/${slug}`)
    : { title: "Update not found" };
}
export default async function Article({ params }: Props) {
  const { slug } = await params;
  const n = news.find((n) => n.slug === slug);
  if (!n) notFound();
  return (
    <>
      <EditorialHero
        eyebrow={n.category}
        title={n.title}
        description={n.excerpt}
      />
      <section className="content-section">
        <Container>
          <article className="prose">
            <p>
              <time dateTime={n.date}>
                {new Date(`${n.date}T12:00:00Z`).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </time>
            </p>
            {n.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <TextLink href="/news">All news & updates</TextLink>
          </article>
        </Container>
      </section>
    </>
  );
}
