"use server";

import {cookies} from "next/headers"

export async function setAuthCookies(user: any) {
  const store = await cookies();
  store.set("session", "true");
  store.set("user", JSON.stringify(user));
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete("session");
  store.delete("user");
}

export async function getSessionCookie() {
  const store = await cookies();
  return store.get("session");
}

export async function getUserCookie() {
  const store = await cookies();
  const raw = store.get("user")?.value;
  return raw ? JSON.parse(raw) : null;
}
