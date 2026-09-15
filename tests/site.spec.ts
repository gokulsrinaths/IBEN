import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
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
];
test("public pages hydrate without React console warnings", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      ["error", "warning"].includes(message.type()) &&
      /hydrat|server.rendered|didn't match|does not match|Minified React error #(418|419|421|422|423|425)/i.test(
        message.text(),
      )
    ) {
      errors.push(`${page.url()}: ${message.text()}`);
    }
  });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [...routes, "/apply?category=hair-colour"]) {
    await page.goto(route);
    // Opening the menu confirms React has hydrated the page before asserting.
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    expect(errors, `Hydration on ${route}`).toEqual([]);
  }
});
test("all public routes, internal links, metadata and missing records", async ({
  page,
  request,
}) => {
  const links = new Set<string>();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).not.toHaveTitle(/Create Next App/);
    expect(
      await page.locator('meta[name="description"]').getAttribute("content"),
    ).toBeTruthy();
    expect(
      await page.locator('link[rel="canonical"]').getAttribute("href"),
    ).toContain(route);
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((elements) =>
        elements.map((el) => el.getAttribute("href")!),
      ))
      links.add(href);
  }
  for (const href of links) {
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
  }
  for (const route of [
    "/missing-page",
    "/professionals/not-a-record",
    "/news/not-an-article",
  ])
    expect((await request.get(route)).status()).toBe(404);
  for (const route of [
    "/sitemap.xml",
    "/robots.txt",
    "/opengraph-image",
    "/icon.svg",
  ])
    expect((await request.get(route)).status()).toBe(200);
  expect(errors).toEqual([]);
});
test("responsive layout and accessible mobile navigation", async ({ page }) => {
  for (const width of [375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [...routes]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}`,
      ).toBe(true);
    }
    await page.goto("/");
    await page.screenshot({
      path: `artifacts/home-${width}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
});
test("accessibility fundamentals across primary experiences", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/apply",
    "/nominate",
    "/professionals",
    "/faq",
    "/contact",
  ]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations,
      `${route}: ${JSON.stringify(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
  }
});
