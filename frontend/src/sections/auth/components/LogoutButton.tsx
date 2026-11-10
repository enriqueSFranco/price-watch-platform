'use client';

import { useDispatch } from 'react-redux';
import { clearUser } from '@/sections/auth/store/auth.slice';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth.actions';


export function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  async function handleLogout() {
    await logoutAction();
    dispatch(clearUser());
    router.replace('/signin');
  }


  return <button onClick={handleLogout}>Cerrar sesión</button>;
}
