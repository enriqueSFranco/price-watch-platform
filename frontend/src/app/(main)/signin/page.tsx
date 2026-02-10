import { AuthForm } from "@/sections/auth/ui/auth-form";

// pagina que muestra el formulario para iniciar sesion
export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[var(--background-primary)] text-[var(--foreground)] px-4">
      <div
        className="
          w-full max-w-md
          bg-white dark:bg-neutral-900
          border border-neutral-200 dark:border-neutral-800
          rounded-3xl shadow-xl
          p-8
          transition-all duration-300
        "
      >
        <h1 className="text-3xl font-semibold text-center mb-6 text-neutral-900 dark:text-neutral-100">
          Bienvenido 👋
        </h1>

        <p className="text-center text-neutral-500 dark:text-neutral-400 mb-8">
          Accede a tu cuenta para continuar
        </p>

        <AuthForm type="signin" />
      </div>
    </div>
  )
}
