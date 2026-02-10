import { Page } from "puppeteer";

export async function blockUnwantedRequests(page: Page, blockedPatters: string[]) {
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const url = req.url();
    const resourceType = req.resourceType();

    const shouldBlock = blockedPatters.some(
      (p) => url.includes(p) || resourceType === p
    );

    if (shouldBlock) return req.abort();
    req.continue();
  });
}
