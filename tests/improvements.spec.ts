import { test, expect, type Page } from "@playwright/test";

async function personalDetails(page: Page) {
  for (const [id, value] of Object.entries({
    fullName: "Test Applicant",
    phone: "+91 98765 43210",
    email: "test@example.com",
    city: "Pune",
    state: "Maharashtra",
    experience: "8",
  }))
    await page.locator(`#${id}`).fill(value);
}
async function practiceDetails(page: Page) {
  await page
    .locator("#professionalType")
    .selectOption("Independent/Freelance Professional");
  await page.locator("#category").selectOption("Hair Colour");
  await page.locator("#specialisations").fill("Colour correction");
  await page.locator("#portfolioUrl").fill("https://example.com/portfolio");
  await page.locator("#bio").fill("Test professional biography.");
  await page.locator("#reason").fill("Test portfolio context.");
}
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

test("phone, email, experience and URL validation rejects invalid entries without console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/apply");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator("#fullName")).toBeFocused();
  await personalDetails(page);
  for (const invalid of [
    "abcdefg",
    "123",
    "+91 98abc543210",
    "1234567890123456",
    "++919876543210",
  ]) {
    await page.locator("#phone").fill(invalid);
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.locator("#phone")).toBeFocused();
    await expect(page.locator("#professionalType")).toHaveCount(0);
  }
  await page.locator("#phone").fill("+91 (98765) 43210");
  await page.locator("#email").fill("invalid");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator("#email")).toBeFocused();
  await page.locator("#email").fill("test@example.com");
  await page.locator("#experience").fill("-1");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator("#experience")).toBeFocused();
  await page.locator("#experience").fill("8");
  await page.getByRole("button", { name: "Continue" }).click();
  await practiceDetails(page);
  for (const url of [
    "instagram.com/test",
    "javascript:alert(1)",
    "ftp://example.com",
  ]) {
    await page.locator("#portfolioUrl").fill(url);
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.locator("#portfolioUrl")).toBeFocused();
  }
  expect(errors).toEqual([]);
});

test("application preserves steps, previews and removes images, and never downloads or posts while unavailable", async ({
  page,
}) => {
  let posts = 0,
    downloads = 0;
  page.on("request", (r) => {
    if (r.url().includes("/api/submissions") && r.method() === "POST") posts++;
  });
  page.on("download", () => downloads++);
  await page.goto("/apply?category=hair-colour");
  await personalDetails(page);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator("#category")).toHaveValue("Hair Colour");
  await practiceDetails(page);
  await page
    .locator("#portfolioFiles")
    .setInputFiles({ name: "photo.heic", mimeType: "image/heic", buffer: png });
  await expect(page.locator(".status-message.error")).toContainText("Use JPG");
  await page
    .locator("#portfolioFiles")
    .setInputFiles({
      name: "large.png",
      mimeType: "image/png",
      buffer: Buffer.alloc(5 * 1024 * 1024 + 1),
    });
  await expect(page.locator(".status-message.error")).toContainText("5 MB");
  await page
    .locator("#portfolioFiles")
    .setInputFiles({
      name: "portfolio.png",
      mimeType: "image/png",
      buffer: png,
    });
  await expect(
    page.getByRole("img", { name: "Preview of portfolio.png" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Remove portfolio.png" }).click();
  await expect(
    page.getByRole("img", { name: "Preview of portfolio.png" }),
  ).toHaveCount(0);
  await page
    .locator("#portfolioFiles")
    .setInputFiles({
      name: "portfolio.png",
      mimeType: "image/png",
      buffer: png,
    });
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator(".review-list")).toContainText("Test Applicant");
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.locator("#bio")).toHaveValue(
    "Test professional biography.",
  );
  await expect(
    page.getByRole("img", { name: "Preview of portfolio.png" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(page.locator('input[name="consent"]')).toBeFocused();
  await page.locator('input[name="consent"]').check();
  await page.locator('input[name="accuracy"]').check();
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(page.locator(".status-message.error")).toContainText(
    "Your application has not been sent",
  );
  expect(posts).toBe(0);
  expect(downloads).toBe(0);
  await expect(page.locator(".review-list")).toContainText("Test Applicant");
});

test("nomination and enquiry have appropriate validation and unavailable messages", async ({
  page,
}) => {
  for (const kind of ["nomination", "enquiry"]) {
    await page.goto(kind === "nomination" ? "/nominate" : "/contact");
    const action = page.getByRole("button", {
      name: kind === "nomination" ? "Submit nomination" : "Send enquiry",
    });
    await action.click();
    expect(await page.locator("input:invalid").count()).toBeGreaterThan(0);
    const fields =
      kind === "nomination"
        ? {
            nominatorName: "Test Nominator",
            nominatorEmail: "test@example.com",
            nomineeName: "Test Nominee",
            city: "Pune",
            portfolioUrl: "https://example.com",
            reason: "Test nomination context.",
          }
        : {
            name: "Test Enquirer",
            email: "test@example.com",
            message: "Test enquiry.",
          };
    for (const [id, value] of Object.entries(fields))
      await page.locator(`#${id}`).fill(value!);
    if (kind === "nomination") {
      await page.locator("#relationship").selectOption("Colleague");
      await page.locator("#category").selectOption("Hair Styling");
      await page.locator('input[name="accuracy"]').check();
    } else await page.locator("#topic").selectOption("General enquiries");
    await page.locator('input[name="consent"]').check();
    await action.click();
    await expect(page.locator(".status-message.error")).toContainText(
      `Your ${kind} has not been sent`,
    );
    if (kind === "enquiry")
      await expect(page.locator(".status-message.error")).not.toContainText(
        "recognition",
      );
  }
});

test("submission endpoint fails closed", async ({ request }) => {
  const availability = await request.get("/api/submissions");
  expect(await availability.json()).toEqual({ available: false });
  expect(availability.headers()["cache-control"]).toContain("no-store");
  const response = await request.post("/api/submissions", {
    data: { kind: "application", values: { phone: "invalid" } },
  });
  expect(response.status()).toBe(503);
  expect(await response.json()).toEqual({ ok: false, code: "unavailable" });
});

test("future transport requires a confirmed receipt and uses enquiry-specific success and failure copy", async ({
  page,
}) => {
  await page.route("**/api/submissions", async (route) => {
    if (route.request().method() === "GET")
      await route.fulfill({ json: { available: true } });
    else await route.fulfill({ json: { ok: true } });
  });
  await page.goto("/contact");
  for (const [id, value] of Object.entries({
    name: "Test Enquirer",
    email: "test@example.com",
    message: "Test only.",
  }))
    await page.locator(`#${id}`).fill(value);
  await page.locator("#topic").selectOption("General enquiries");
  await page.locator('input[name="consent"]').check();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator(".status-message.error")).toContainText(
    "could not confirm receipt of your enquiry",
  );
  await expect(page.locator(".status-message")).not.toContainText(
    "recognition",
  );
  await page.unroute("**/api/submissions");
  await page.route("**/api/submissions", (route) =>
    route.fulfill({
      json:
        route.request().method() === "GET"
          ? { available: true }
          : { ok: true, reference: "TEST-ONLY-RECEIPT" },
    }),
  );
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Your enquiry has been received",
  );
  await expect(page.getByRole("status")).toContainText("TEST-ONLY-RECEIPT");
  await expect(page.getByRole("status")).not.toContainText("recognition");
});

test("navigation resets across desktop breakpoint; empty content is not promoted", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator('a[href="/news"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
  await page.goto("/professionals");
  await expect(page.locator('select,input[type="search"]')).toHaveCount(0);
  await expect(page.locator("main")).toContainText("after the 2026 selection");
  await page.goto("/news");
  await expect(page.locator(".news-tabs")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await page.goto("/faq");
  await page.locator("summary").first().click();
  await expect(page.locator("details[open]")).toBeVisible();
});

test("task pages bring the primary task into reach on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [route, selector] of [
    ["/apply", "#fullName"],
    ["/nominate", "#nominatorName"],
    ["/contact", "#name"],
    ["/professionals", ".empty-state"],
    ["/faq", "summary"],
  ]) {
    await page.goto(route);
    expect(
      await page
        .locator(selector)
        .first()
        .evaluate((e) => e.getBoundingClientRect().top),
      route,
    ).toBeLessThan(760);
  }
});

test("all internal pages include social preview metadata and Top 50 has the explicit SEO title", async ({
  page,
}) => {
  for (const route of [
    "/about",
    "/recognition",
    "/top-50",
    "/professionals",
    "/categories",
    "/apply",
    "/nominate",
    "/selection-process",
    "/standards",
    "/news",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
  ]) {
    await page.goto(route);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /\/opengraph-image/,
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      /\/opengraph-image/,
    );
  }
  await page.goto("/top-50");
  await expect(page).toHaveTitle(
    "IBEN Top 50 Beauty Professionals 2026 | IBEN",
  );
});
