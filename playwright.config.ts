import { defineConfig } from "@playwright/test";
const development = process.env.PLAYWRIGHT_DEV === "1";
const baseURL = development ? "http://localhost:3001" : "http://localhost:3000";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL,
    browserName: "chromium",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: development ? "npm run dev -- --port 3001" : "npm run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
