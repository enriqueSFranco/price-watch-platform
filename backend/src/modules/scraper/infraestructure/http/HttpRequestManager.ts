import { Page } from "puppeteer";
export type RotationStrategy = "random" | "round-robin" | "sticky";

const defaultUAs: string[] = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/119.0.2151.97",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
];

export class HttpRequestManager {
  private rrIndex = 0;
  private stickyMap = new Map<string, string>();
  constructor(
    private userAgents: ReadonlyArray<string> = [],
    private readonly rotation?: RotationStrategy
  ) {
    this.userAgents = Object.freeze(
      this.userAgents && this.userAgents.length > 0
        ? this.userAgents
        : defaultUAs
    );
    this.rotation = this.rotation ?? "round-robin";
  }

  public getUserAgentFor(url?: string): string {
    if (this.userAgents.length === 0) return "Mozilla/5.0";

    if (this.rotation === "random") {
      return this.randomUA();
    }

    if (this.rotation === "round-robin") {
      return this.roundRobinUA();
    }

    if (this.rotation === "sticky" && url) {
      try {
        const host = new URL(url).host;
        if (!this.stickyMap.has(host)) return this.stickyMap.get(host)!;
        const ua = this.roundRobinUA();
        this.stickyMap.set(url, ua);
        return ua;
      } catch (e) {
        return this.randomUA();
      }
    }
    return this.randomUA();
  }

  /**
   * @description Obtiene un user-agent de forma aleatorio
   * @returns Un string que es el user-agent aleatorio de la lista userAgents
   */
  public randomUA = (): string => {
    const randomIndex = Math.floor(Math.random() * this.userAgents.length);
    const ua = this.userAgents[randomIndex];
    console.log("pick-random-ua", { randomIndex, ua });
    return ua;
  };

  public roundRobinUA = () => {
    const ua = this.userAgents[this.rrIndex % this.userAgents.length];
    console.log("pick-rr-ua", { idx: this.rrIndex, ua });
    this.rrIndex++;
    return ua;
  };

  // TODO: Pasar a un RequestPutter file
  public setPageHeaders = async (page: Page, url?: string): Promise<void> => {
    const ua = this.getUserAgentFor(url);
    page.setUserAgent(ua);
    const baseRequestHeaders = {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.5",
      DNT: "1",
      "Upgrade-Insecure-Requests": "1",
    };
    console.log("set-page-headers", { ua, url });
    await page.setExtraHTTPHeaders(baseRequestHeaders);
  };
  /**
   * TODO: valida min <= max
   * @description Genera un retraso aleatorio (jitter) para evitar ser detectado.
   * @param minMs - minimo retraso
   * @param maxMs - maximo retraso
   */
  public delay = async (minMs: number, maxMs: number): Promise<void> => {
    if (minMs < 0 || maxMs < 0) throw new Error("min/max must be >= 0");
    // swap
    if (minMs > maxMs) {
      [minMs, maxMs] = [maxMs, minMs];
    }

    const jitter = Math.random() * (maxMs - minMs) + minMs;
    console.log("delay", { jitter });
    return new Promise((resolve) => setTimeout(resolve, jitter));
  };

  public getAvailableUserAgents(): ReadonlyArray<string> {
    return this.userAgents;
  }
}
