import { loginAction } from "@/app/actions/auth.actions";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/auth.slice";

export function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const user = await loginAction(email, password);

    dispatch(loginSuccess(user)); // opcional para UI

    router.push('/dashboard');
  }
  return (
    <div aria-labelledby="formulario de iniciar sesion" className="w-full flex flex-col gap-6 px-6 py-2">
      <form
        onSubmit={handleSubmit}
        aria-describedby="auth-description"
        className="flex flex-col gap-6 divide-y-2 divide-gray-700"
      >
        {/* formulario con email y password */}
        <div className="flex flex-col gap-2 w-full">
          <input name="email" type="email" placeholder="email" />
          <input name="password" type="password" placeholder="password" />
          <button type="submit">login</button>
        </div>
      </form>
    </div>
  )
}
