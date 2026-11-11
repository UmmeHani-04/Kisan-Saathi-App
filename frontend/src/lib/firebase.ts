import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";

// These values come from frontend/.env (see .env.example). Firebase web settings are
// identifiers, not secrets, so it is normal for them to be visible in the browser.
const config = {
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"],
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"],
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"],
  appId: import.meta.env["VITE_FIREBASE_APP_ID"],
};

export const isAuthConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId,
);

let cached: Auth | null = null;

/** Returns null on the server, or when the Firebase settings are missing (the site still works). */
export function getFirebaseAuth(): Auth | null {
  if (typeof window === "undefined" || !isAuthConfigured) return null;
  if (!cached) {
    const app = getApps().length ? getApp() : initializeApp(config);
    cached = getAuth(app);
  }
  return cached;
}