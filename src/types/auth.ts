/**
 * @file src/types/auth.ts
 * @description Tipos compartidos para el módulo de autenticación.
 *
 * Este archivo contiene únicamente tipos e interfaces que se reutilizan
 * en más de una capa del sistema (features, services, middleware).
 *
 * Tipos específicos de un solo componente deben permanecer en su feature:
 * - Errores de validación → `src/features/auth/utils/login-validation.ts`
 * - Mapa de redirección  → `src/features/auth/constants/role-redirect.ts`
 *
 * @see SRS sección 8 — Roles y Matriz de Permisos
 * @see HU-02F — Formulario e Interfaz de Login
 */

/**
 * Roles oficiales del sistema según el SRS.
 *
 * | Rol             | Acceso principal          |
 * |-----------------|---------------------------|
 * | `ADMIN`         | `/admin`                  |
 * | `CLIENT`        | `/client`                 |
 * | `TICKET_SELLER` | `/employee/pos`           |
 * | `QR_VALIDATOR`  | `/scanner` (provisional)  |
 */
export type UserRole = 'ADMIN' | 'CLIENT' | 'TICKET_SELLER' | 'QR_VALIDATOR';

/**
 * Datos que el formulario de login envía al proveedor de NextAuth.
 *
 * Ambos campos son obligatorios; la validación de formato
 * se ejecuta en cliente antes del submit.
 *
 * @see src/features/auth/utils/login-validation.ts
 */
export interface LoginFormData {
  /** Correo electrónico del usuario. */
  email: string;
  /** Contraseña en texto plano (se transmite por HTTPS y NextAuth la hashea). */
  password: string;
}

/**
 * Datos del usuario incluidos en la sesión activa de NextAuth.
 *
 * Se obtienen desde `/api/auth/session` tras un login exitoso
 * y se usan para determinar la redirección condicional por rol.
 *
 * @see src/features/auth/constants/role-redirect.ts
 */
export interface AuthSessionUser {
  /** Identificador único del usuario en la base de datos. */
  id: string;
  /** Nombre completo del usuario. */
  name: string;
  /** Correo electrónico del usuario. */
  email: string;
  /** Rol asignado; determina los permisos y la ruta de acceso. */
  role: UserRole;
}
