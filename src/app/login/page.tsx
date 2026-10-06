/**
 * @file src/app/login/page.tsx
 * @description Ruta pública `/login` — HU-02F.
 *
 * Responsabilidades:
 * - Servir como Server Component de la ruta `/login`.
 * - Proveer metadata de la página (SEO / título de pestaña).
 * - Centrar y contener el componente `LoginForm` sobre el fondo de marca.
 *
 * Lo que esta página NO hace:
 * - Contener lógica de autenticación (delegada a `LoginForm`).
 * - Redirigir usuarios ya autenticados (se implementará en `middleware.ts`
 *   cuando NextAuth esté disponible — HU02-B).
 *
 * @see src/features/auth/components/login-form.tsx — Formulario interactivo
 * @see src/middleware.ts                            — Protección de rutas (pendiente HU02-B)
 */

import React from 'react';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata = {
  title: 'Iniciar Sesión | Vice City',
  description: 'Accede al sistema de reservas Vice City Sports.',
};

/**
 * Página de inicio de sesión.
 *
 * Usa `bg-club-bg` como fondo para mantener la identidad de marca
 * definida en `src/app/globals.css`.
 */
export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-club-bg flex items-center justify-center p-4 sm:p-8">
      <LoginForm />
    </main>
  );
}
