"use client";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { ROUTES } from "@/config/my-routes";
import { TextInput } from "@/sections/core/desing-system/TextInput/TextInput";
import styles from "./auth-form.module.css";

interface AuthFormProps {
  type: "signin" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const formTitle = type === "signup" ? "crear cuenta" : "iniciar sesión";
  const linkText = type === "signup" ? "iniciar sesión" : "crear cuenta";
  const linkHref = type === "signup" ? ROUTES.SIGN_IN : ROUTES.SIGN_UP;

  function handleAuthUser() {}

  return (
    <div
      aria-labelledby={`auth-${formTitle}`}
      className="w-full flex flex-col gap-6 px-6 py-2"
    >
      <form aria-describedby="auth-description" className="flex flex-col gap-6">
        {type === "signin" && (
          <>
            <fieldset className="flex flex-col gap-3">
              <legend className="sr-only">
                Opciones de inicio de sesión social
              </legend>

              <button
                type="button"
                className="
                  flex items-center justify-center w-full h-11
                  rounded-xl border border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-900
                  text-neutral-700 dark:text-neutral-200
                  font-medium transition-all
                  hover:bg-neutral-100 dark:hover:bg-neutral-800
                  active:scale-[0.98]
                "
                aria-label="Iniciar sesión con Google"
              >
                iniciar sesión con Google
              </button>

              <button
                type="button"
                className="
                  flex items-center justify-center w-full h-11
                  rounded-xl border border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-900
                  text-neutral-700 dark:text-neutral-200
                  font-medium transition-all
                  hover:bg-neutral-100 dark:hover:bg-neutral-800
                  active:scale-[0.98]
                "
                aria-label="Iniciar sesión con Facebook"
              >
                iniciar sesión con Facebook
              </button>
            </fieldset>
            {/* separador */}
            <div
              className="flex items-center gap-2"
              role="separator"
              aria-label="o continúa con correo"
            >
              <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700" />
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                o
              </span>
              <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700" />
            </div>
            <div>
              {/* form */}
              <fieldset className="flex flex-col gap-3">
                <legend className="sr-only">
                  Formulario de inicio de sesión tradicional
                </legend>

                <TextInput
                  label="correo electrónico"
                  id="email"
                  type="email"
                  required
                />

                <TextInput
                  label="contraseña"
                  id="password"
                  type="password"
                  required
                />

                <button
                  type="submit"
                  className="
                  w-full h-12 rounded-xl
                  bg-[#009de0] dark:bg-[#009DE0]
                  text-white font-semibold
                  hover:bg-[#008ac4]
                  active:scale-[0.98]
                  transition-all shadow-sm
                "
                >
                  {formTitle}
                </button>
              </fieldset>
            </div>
          </>
        )}
      </form>
      <footer>
        {type === "signin" && (
          <p>
            ¿No tienes una cuenta? <Link href={linkHref} className="hover:text-[#009DE0] transition-colors duration-300 ease-in-out">{linkText}</Link>
          </p>
        )}
      </footer>
    </div>
  );
}
