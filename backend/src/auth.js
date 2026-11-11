// Optional login check for the chat API using Firebase ID tokens.
// No firebase-admin needed: we verify the token's signature against Google's
// public keys using the small "jose" library.

import { createRemoteJWKSet, jwtVerify } from "jose";

const GOOGLE_JWKS_URL = new URL(
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
);

const noopMiddleware = (_req, _res, next) => next();

/**
 * @param {{ projectId?: string, required?: boolean, jwks?: Function }} options
 *   projectId - your Firebase project id (same project as the frontend)
 *   required  - true = only logged-in users may use the chat
 *   jwks      - key set override (used by tests)
 */
export function createAuth({ projectId, required = false, jwks } = {}) {
  if (!projectId) {
    if (required) {
      throw new Error("REQUIRE_LOGIN=true needs FIREBASE_PROJECT_ID to be set in backend/.env");
    }
    return { enabled: false, required: false, middleware: noopMiddleware };
  }

  const keySet = jwks ?? createRemoteJWKSet(GOOGLE_JWKS_URL);

  async function middleware(req, res, next) {
    const header = req.get("authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

    if (!token) {
      if (required) {
        return res
          .status(401)
          .json({ error: "Please log in to use the assistant.", code: "login_required" });
      }
      return next(); // anonymous use is allowed
    }

    try {
      const { payload } = await jwtVerify(token, keySet, {
        issuer: `https://securetoken.google.com/${projectId}`,
        audience: projectId,
        algorithms: ["RS256"],
      });
      if (!payload.sub) throw new Error("Token has no subject");
      req.user = {
        uid: payload.sub,
        email: typeof payload.email === "string" ? payload.email : undefined,
        name: typeof payload.name === "string" ? payload.name : undefined,
      };
      return next();
    } catch (error) {
      if (required) {
        return res.status(401).json({
          error: "Your login has expired. Please log in again.",
          code: "invalid_token",
        });
      }
      // Login not required: ignore a bad token and treat the visitor as anonymous.
      console.warn("Ignoring invalid login token:", error?.code ?? error?.message);
      return next();
    }
  }

  return { enabled: true, required, middleware };
}

export function createAuthFromEnv(env = process.env) {
  return createAuth({
    projectId: env.FIREBASE_PROJECT_ID?.trim() || undefined,
    required: env.REQUIRE_LOGIN === "true",
  });
}