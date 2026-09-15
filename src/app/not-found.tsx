import { Container, Button } from "@/components/ui";
export default function NotFound() {
  return (
    <section className="section">
      <Container>
        <p className="eyebrow">404 · PAGE NOT FOUND</p>
        <h1 style={{ margin: "20px 0" }}>Let’s find your way.</h1>
        <p className="lead" style={{ marginBottom: 30 }}>
          This page or recognition record is not published. Check the address or
          explore the IBEN directory.
        </p>
        <div className="button-row">
          <Button href="/">Back to IBEN</Button>
          <Button href="/professionals" outline>
            Professional directory
          </Button>
        </div>
      </Container>
    </section>
  );
}
