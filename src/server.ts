import "./lib/error-capture";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// ── Safe filesystem helpers ────────────────────────────────────────────────
// node:fs is NOT available on Vercel Edge / Cloudflare Workers runtimes.
// These helpers degrade gracefully to no-ops on those platforms.

function safeReadJson(filePath: string): unknown | null {
  try {
    // Dynamic require so bundlers that target edge don't fail at parse time.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("node:fs") as typeof import("node:fs");
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function safeWriteJson(filePath: string, data: unknown): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { join } = require("node:path") as typeof import("node:path");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("node:fs") as typeof import("node:fs");
    void join; // keep import alive
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // silently ignore — edge runtimes don't have writable fs
  }
}

function getFilePath(name: string): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("node:path") as typeof import("node:path");
    return path.join(process.cwd(), name);
  } catch {
    return name;
  }
}

const PROFILE_FILE = getFilePath(".shared_profile.json");
const APPOINTMENTS_FILE = getFilePath(".shared_appointments.json");

let globalSharedProfile: unknown = safeReadJson(PROFILE_FILE);
let globalSharedAppointments: unknown[] = (safeReadJson(APPOINTMENTS_FILE) as unknown[]) ?? [];

// ── Response helpers ───────────────────────────────────────────────────────

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// ── Inline favicon SVG (medical cross) ────────────────────────────────────
const FAVICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
  '<circle cx="50" cy="50" r="50" fill="white"/>' +
  '<rect x="40" y="15" width="20" height="70" rx="4" fill="#2563EB"/>' +
  '<rect x="15" y="40" width="70" height="20" rx="4" fill="#2563EB"/>' +
  "</svg>";

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      // Provide a base URL fallback in case request.url is relative (e.g., in some dev environments)
      const url = new URL(request.url, "http://localhost");

      // ── 0. Favicon — serve inline so 500 never fires ───────────────────
      if (url.pathname === "/favicon.ico" || url.pathname === "/favicon.svg") {
        return new Response(FAVICON_SVG, {
          status: 200,
          headers: {
            "content-type": "image/svg+xml",
            "cache-control": "public, max-age=86400, immutable",
          },
        });
      }

      // ── 1. Profile sync endpoint ───────────────────────────────────────
      if (url.pathname === "/api/profile") {
        if (request.method === "POST") {
          try {
            const data = await request.json() as Record<string, unknown>;
            if (data && data["name"]) {
              globalSharedProfile = data;
              safeWriteJson(PROFILE_FILE, data);
            }
            return json({ success: true, profile: globalSharedProfile });
          } catch {
            return json({ success: false }, 400);
          }
        } else {
          const current = globalSharedProfile ?? safeReadJson(PROFILE_FILE);
          return json(current ?? null);
        }
      }

      // ── 2. Appointments sync endpoint ──────────────────────────────────
      if (url.pathname === "/api/appointments") {
        if (request.method === "POST") {
          try {
            const data = await request.json() as unknown;
            if (Array.isArray(data)) {
              globalSharedAppointments = data;
            } else if (data && typeof data === "object") {
              globalSharedAppointments.push(data);
            }
            safeWriteJson(APPOINTMENTS_FILE, globalSharedAppointments);
            return json({ success: true, appointments: globalSharedAppointments });
          } catch {
            return json({ success: false }, 400);
          }
        } else {
          const current = (safeReadJson(APPOINTMENTS_FILE) as unknown[]) ?? globalSharedAppointments;
          return json(current);
        }
      }

      // ── 3. Everything else → SSR handler ──────────────────────────────
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};

