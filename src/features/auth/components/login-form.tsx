'use client';

/**
 * @file src/features/auth/components/login-form.tsx
 * @description Formulario de inicio de sesión — HU-02F.
 *
 * Responsabilidades de este componente:
 * 1. Renderizar el layout de dos columnas (branding + formulario).
 * 2. Gestionar el estado local de los campos y la UI (loading, errores).
 * 3. Ejecutar las validaciones de cliente antes de enviar.
 * 4. Delegar la autenticación a NextAuth `signIn` (punto de integración marcado).
 * 5. Redirigir al usuario según su rol usando `ROLE_REDIRECT_MAP`.
 *
 * Lo que este componente NO hace:
 * - Implementar lógica de negocio del servidor.
 * - Validar existencia de usuario o estado de cuenta (responsabilidad del Backend).
 * - Gestionar tokens JWT directamente.
 *
 * @see src/features/auth/utils/login-validation.ts  — Reglas de validación
 * @see src/features/auth/constants/role-redirect.ts — Mapa de redirección por rol
 * @see src/types/auth.ts                            — Tipos compartidos
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  validateLoginForm,
  isLoginFormValid,
  type LoginValidationErrors,
} from '../utils/login-validation';
import { ROLE_REDIRECT_MAP, DEFAULT_REDIRECT } from '../constants/role-redirect';
import type { UserRole } from '@/types/auth';

// ---------------------------------------------------------------------------
// Mensajes de error globales (errores de red / credenciales inválidas)
// ---------------------------------------------------------------------------

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Credenciales inválidas. Comprueba tu correo y contraseña.',
  NETWORK_ERROR: 'Error de conexión con el servidor. Inténtalo de nuevo.',
} as const;

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

/**
 * Formulario de inicio de sesión de Vice City.
 *
 * Estados de la UI:
 * - **Normal**     → Campos vacíos, botón activo.
 * - **Validación** → Errores de campo visibles si el usuario envía el formulario incompleto.
 * - **Loading**    → Botón deshabilitado, texto "Iniciando sesión…".
 * - **Error**      → Banner de error global (credenciales o red).
 * - **Éxito**      → Redirección automática según el rol del usuario.
 */
export function LoginForm() {
  const router = useRouter();

  // ── Estado de los campos ────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ── Estado de la UI ─────────────────────────────────────────────────────
  const [fieldErrors, setFieldErrors] = useState<LoginValidationErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  /**
   * Limpia el error de un campo específico al comenzar a escribir.
   * Mejora la experiencia de usuario: el error desaparece en cuanto el
   * usuario corrige el valor, sin esperar al siguiente envío.
   */
  const clearFieldError = (field: keyof LoginValidationErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Manejador principal del formulario.
   *
   * Flujo:
   * 1. Previene el submit nativo.
   * 2. Limpia errores anteriores.
   * 3. Valida los campos en cliente; aborta si hay errores.
   * 4. Llama a NextAuth `signIn` (punto de integración con HU02-B).
   * 5. Lee el rol de la sesión y redirige a la ruta correspondiente.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError(null);

    // ── 1. Validación de cliente ───────────────────────────────────────────
    const errors = validateLoginForm(email, password);
    if (!isLoginFormValid(errors)) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      // ======================================================================
      // 🔗 PUNTO DE INTEGRACIÓN — NextAuth credentials provider (HU02-B)
      //
      // Descomentar este bloque cuando el Backend de autenticación esté listo.
      // Requiere: next-auth instalado y configurado en src/app/api/auth/[...nextauth]/route.ts
      // ======================================================================
      /*
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setGlobalError(ERROR_MESSAGES.INVALID_CREDENTIALS);
        setIsLoading(false);
        return;
      }

      // Leer el rol desde la sesión activa
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      const userRole = (session?.user?.role as UserRole) ?? 'CLIENT';

      // Redirigir según el rol del SRS
      const destination = ROLE_REDIRECT_MAP[userRole] ?? DEFAULT_REDIRECT;
      router.push(destination);
      */

      // ── Mock temporal — eliminar al integrar NextAuth ──────────────────────
      await new Promise<void>((resolve) => setTimeout(resolve, 1200));
      setIsLoading(false);
      // ── Fin mock ───────────────────────────────────────────────────────────
    } catch {
      // Error de red u otro fallo inesperado
      setGlobalError(ERROR_MESSAGES.NETWORK_ERROR);
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div
      className="w-full max-w-[880px] bg-club-surface rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[480px]"
      style={{
        border: '1.5px solid #b0bf3f',
        boxShadow:
          '0 8px 40px rgba(176, 191, 63, 0.13), 0 2px 12px rgba(0,0,0,0.07)',
      }}
    >
      {/* ── COLUMNA IZQUIERDA: Branding ────────────────────────────────────── */}
      <div className="bg-club-surface flex items-center justify-center p-10 md:p-14 border-b md:border-b-0 md:border-r border-[#b0bf3f]/30">
        <div className="flex flex-col items-center gap-3 select-none">
          {/*
           * Logo Vice City — representación tipográfica.
           * Sin imágenes para mantener la carga ligera y evitar dependencias
           * de archivos de /public en este entorno de desarrollo.
           */}
          <div
            className="border-2 border-club-accent px-8 py-6 flex flex-col items-center leading-none"
            style={{ minWidth: 180 }}
          >
            <span
              className="text-5xl font-black text-club-accent uppercase"
              style={{ fontFamily: 'serif', letterSpacing: '0.08em' }}
            >
              VICE
            </span>
            <span
              className="text-5xl font-black text-club-accent uppercase"
              style={{ fontFamily: 'serif', letterSpacing: '0.08em' }}
            >
              CITY
            </span>
            <span
              className="text-xs font-bold mt-1 uppercase tracking-[0.3em]"
              style={{ color: '#b0bf3f' }}
            >
              Sports
            </span>
          </div>
        </div>
      </div>

      {/* ── COLUMNA DERECHA: Formulario ────────────────────────────────────── */}
      <div className="bg-club-surface p-8 md:p-12 flex flex-col relative">
        {/* Badge de marca — esquina superior derecha */}
        <div className="absolute top-5 right-5 border border-club-accent/25 rounded px-1.5 py-1 flex flex-col items-center leading-none">
          <span className="text-[9px] font-black text-club-accent tracking-widest">VC</span>
          <span className="text-[9px] font-black text-club-accent tracking-widest">—</span>
        </div>

        <div className="my-auto w-full max-w-sm mx-auto pt-6 md:pt-0">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-club-accent tracking-tight">
              Bienvenido
            </h1>
            <p className="text-sm italic text-text-muted mt-2 font-serif">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/*
           * Banner de error global.
           * Se muestra ante credenciales inválidas o fallos de red.
           * Los errores de campo se muestran bajo cada input.
           */}
          {globalError && (
            <div
              role="alert"
              className="mb-5 px-4 py-3 rounded-xl text-xs font-medium text-center"
              style={{
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
              }}
            >
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* ── Campo: Correo ─────────────────────────────────────────── */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-text-main mb-1.5"
              >
                Usuario / Correo
              </label>
              <input
                id="email"
                type="email"
                value={email}
                autoComplete="email"
                placeholder="Ingresa tu correo"
                disabled={isLoading}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                aria-invalid={!!fieldErrors.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError('email');
                }}
                className={[
                  'w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none bg-club-surface',
                  'placeholder:text-text-muted/60 disabled:opacity-50 disabled:cursor-not-allowed',
                  fieldErrors.email
                    ? 'border-red-400 focus:ring-2 focus:ring-red-300'
                    : 'border-[#b0bf3f]/60 focus:border-[#b0bf3f] focus:ring-2 focus:ring-[#b0bf3f]/25',
                ].join(' ')}
              />
              {fieldErrors.email && (
                <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-500 font-medium">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* ── Campo: Contraseña ─────────────────────────────────────── */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-text-main mb-1.5"
              >
                Contraseña
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                disabled={isLoading}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                aria-invalid={!!fieldErrors.password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError('password');
                }}
                className={[
                  'w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none bg-club-surface',
                  'placeholder:text-text-muted/60 disabled:opacity-50 disabled:cursor-not-allowed',
                  fieldErrors.password
                    ? 'border-red-400 focus:ring-2 focus:ring-red-300'
                    : 'border-[#b0bf3f]/60 focus:border-[#b0bf3f] focus:ring-2 focus:ring-[#b0bf3f]/25',
                ].join(' ')}
              />
              {fieldErrors.password && (
                <p id="password-error" role="alert" className="mt-1.5 text-xs text-red-500 font-medium">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* ── Toggle: Mostrar contraseña ────────────────────────────── */}
            <div className="flex items-center gap-2">
              <input
                id="show-password"
                type="checkbox"
                checked={showPassword}
                disabled={isLoading}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 rounded border-[#b0bf3f] accent-[#b0bf3f] cursor-pointer"
              />
              <label
                htmlFor="show-password"
                className="text-sm text-text-muted cursor-pointer select-none"
              >
                Mostrar contraseña
              </label>
            </div>

            {/* ── Botón de submit ───────────────────────────────────────── */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-full text-sm font-bold tracking-wider uppercase transition-colors duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b0bf3f] focus-visible:ring-offset-2 active:scale-[0.98]"
              style={{ background: '#b0bf3f', color: '#ffffff' }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.background = '#9da833';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#b0bf3f';
              }}
            >
              {isLoading ? 'Iniciando sesión…' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* ── Enlace a registro ─────────────────────────────────────────── */}
          <p className="mt-6 text-center text-xs text-text-muted">
            ¿No tienes cuenta?{' '}
            <Link
              href="/register"
              className="font-bold text-club-accent hover:text-[#b0bf3f] transition-colors underline underline-offset-2"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
