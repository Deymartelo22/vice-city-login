/**
 * @file src/features/auth/constants/role-redirect.ts
 * @description Mapa de redirección por rol tras un login exitoso.
 *
 * Cada rol del SRS tiene una ruta de destino única. La redirección
 * se ejecuta en `LoginForm` después de recibir la sesión de NextAuth.
 *
 * Rutas según el SRS (sección 8 — Roles y Matriz de Permisos):
 * - `ADMIN`         → `/admin`          Panel de administración
 * - `CLIENT`        → `/client`         Portal del cliente (reservas, historial)
 * - `TICKET_SELLER` → `/employee/pos`   Módulo POS presencial
 * - `QR_VALIDATOR`  → `/scanner`        Escáner QR (ruta a confirmar con Backend — HU02-B)
 *
 * @see HU-02F — Formulario e Interfaz de Login
 * @see SRS sección 8 — Roles y Matriz de Permisos
 */

import type { UserRole } from '@/types/auth';

/**
 * Destino de redirección para cada rol del sistema.
 *
 * La ruta de `QR_VALIDATOR` (`/scanner`) es provisional hasta que
 * Backend confirme la ruta definitiva en HU02-B.
 */
export const ROLE_REDIRECT_MAP: Record<UserRole, string> = {
  ADMIN: '/admin',
  CLIENT: '/client',
  TICKET_SELLER: '/employee/pos',
  QR_VALIDATOR: '/scanner', // TODO: confirmar ruta definitiva con HU02-B
} as const;

/**
 * Ruta de fallback si el rol recibido no está en el mapa.
 * No debería ocurrir en producción; sirve como red de seguridad.
 */
export const DEFAULT_REDIRECT = '/client' as const;
