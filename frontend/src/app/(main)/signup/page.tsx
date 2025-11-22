import { AuthForm } from "@/sections/auth/ui/auth-form";

// pagina que muestra el formulario para crear cuenta
export default function Page() {
  return (
    <div className="flex place-content-center w-full h-full">
      <AuthForm type="signup" />
    </div>
  )
}
