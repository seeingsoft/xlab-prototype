const path = require("path");
const fs = require("fs");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require(
    "/Users/xinyingjiang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright",
  ));
}

const version = "v1.0-20260810-1640";
const prefix = `xlab后台管理系统完整交互原型-${version}`;
const output = path.resolve(__dirname, "../artifacts/screenshots");
const baseUrl = process.env.XLAB_ADMIN_PROTOTYPE_URL || "http://127.0.0.1:4176";
fs.mkdirSync(output, { recursive: true });

async function assertNoHorizontalOverflow(page, label) {
  const widths = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  if (widths.document > widths.viewport + 1) {
    throw new Error(`${label} overflows horizontally: ${JSON.stringify(widths)}`);
  }
}

async function assertTouchTargets(page, label) {
  const undersized = await page.locator("button:not([disabled])").evaluateAll((buttons) => buttons
    .map((button) => {
      const rect = button.getBoundingClientRect();
      return { name: button.getAttribute("aria-label") || button.textContent?.trim(), width: rect.width, height: rect.height };
    })
    .filter((item) => item.width < 43.5 || item.height < 43.5));
  if (undersized.length) throw new Error(`${label} has undersized touch targets: ${JSON.stringify(undersized)}`);
}

async function screenshot(page, file) {
  await page.evaluate(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(output, `${prefix}-${file}.png`), fullPage: true });
}

async function captureAdmin(page, label, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(`${baseUrl}/admin`, { waitUntil: "networkidle" });
  await page.waitForTimeout(250);
  await assertNoHorizontalOverflow(page, `${label} admin dashboard`);

  if (await page.getByRole("button", { name: /自动发布/ }).count()) {
    throw new Error("automatic publish action leaked into the prototype");
  }
  await screenshot(page, `${label}-admin-dashboard`);

  const nav = page.getByRole("navigation", { name: "运营主导航" });
  await nav.getByRole("button", { name: "人员与权限" }).click();
  await page.getByLabel("邀请或权限意图").fill("邀请李老师只管理这门课，课程归档后自动失效");
  await page.getByRole("button", { name: "生成最小权限邀请" }).click();
  await assertNoHorizontalOverflow(page, `${label} identity and access`);
  await screenshot(page, `${label}-admin-identity-access`);

  await nav.getByRole("button", { name: "探索编辑部" }).click();
  await page.getByRole("button", { name: "查看发布检查" }).click();
  await assertNoHorizontalOverflow(page, `${label} exploration editorial`);
  await screenshot(page, `${label}-admin-exploration-editorial`);

  await page.getByRole("tab", { name: "纠错与撤回" }).click();
  await page.getByLabel("撤回原因").fill("合成演练：原始来源已失效。");
  await screenshot(page, `${label}-admin-exploration-correction`);

  await nav.getByRole("button", { name: "审计与设置" }).click();
  await assertNoHorizontalOverflow(page, `${label} audit settings`);
  await screenshot(page, `${label}-admin-audit-settings`);
}

async function captureOps(page, label, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(`${baseUrl}/ops`, { waitUntil: "networkidle" });
  await page.waitForTimeout(220);
  const shellWidth = await page.locator(".ops-mobile").evaluate((element) => element.getBoundingClientRect().width);
  if (shellWidth > 430.5) throw new Error(`operations H5 expanded beyond 430px: ${shellWidth}`);
  await assertNoHorizontalOverflow(page, `${label} operations H5 home`);
  await assertTouchTargets(page, `${label} operations H5 home`);
  await screenshot(page, `${label}-ops-home`);

  await page.getByRole("button", { name: "快速审核探索报" }).click();
  await assertNoHorizontalOverflow(page, `${label} exploration review`);
  await assertTouchTargets(page, `${label} exploration review`);
  await screenshot(page, `${label}-ops-exploration-review`);
}

async function assertAccessibilityModes(page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto(`${baseUrl}/admin`, { waitUntil: "networkidle" });
  const animationName = await page.locator(".admin-page").evaluate((element) => getComputedStyle(element).animationName);
  if (animationName !== "none") throw new Error(`reduced-motion did not disable page animation: ${animationName}`);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/ops`, { waitUntil: "networkidle" });
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await assertNoHorizontalOverflow(page, "operations H5 at 200% text size");
  if (!(await page.getByRole("button", { name: "快速审核探索报" }).isVisible())) {
    throw new Error("critical exploration action is not visible at 200% text size");
  }
  await page.evaluate(() => { document.documentElement.style.fontSize = ""; });
  await page.emulateMedia({ reducedMotion: "no-preference" });
}

(async () => {
  const browser = await chromium.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const page = await browser.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", (error) => pageErrors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await captureAdmin(page, "desktop-1440", 1440, 1000);
  await captureAdmin(page, "desktop-1024", 1024, 900);
  await captureOps(page, "mobile-390", 390, 844);
  await captureOps(page, "mobile-375", 375, 812);
  await captureOps(page, "mobile-320", 320, 700);
  await captureOps(page, "mobile-landscape-844", 844, 390);
  await assertAccessibilityModes(page);

  if (pageErrors.length) throw new Error(`browser page errors: ${JSON.stringify(pageErrors)}`);
  if (consoleErrors.length) throw new Error(`browser console errors: ${JSON.stringify(consoleErrors)}`);

  await browser.close();
  process.stdout.write("xlab admin Web and operations H5 interaction checks passed.\n");
})().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
