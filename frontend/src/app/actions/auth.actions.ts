"use server";

import { AuthService } from "@/modules/auth/application/services/auth.service";

import { clearAuthCookies, setAuthCookies } from "@/modules/auth/infrastructure/persistence/auth.cookies";

export async function logoutAction() {
  await service.logout();
  await clearAuthCookies();
  return true;
}

const service = new AuthService();

export async function loginAction(email: string, password: string) {
  const user = await service.login(email, password);

  await setAuthCookies(user);

  return user;
}

