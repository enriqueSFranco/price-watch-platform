"use client";

import { useSelector } from "react-redux";

export function useAuth() {
  const user = useSelector((s: any) => s.auth.user);
  const isAuthenticated = useSelector((s: any) => s.auth.isAuthenticated);

  return { user, isAuthenticated };
}
