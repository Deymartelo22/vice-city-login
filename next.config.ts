/**
 * @file next.config.ts
 * @description Configuración de Next.js para Vice City.
 *
 * La redirección de `/` → `/login` se define aquí a nivel de servidor
 * para evitar un render innecesario antes del redirect.
 * Cuando el middleware de autenticación esté activo (HU02-B), esta
 * redirección quedará implícita para usuarios no autenticados.
 */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false, // 307 — temporal hasta que el middleware gestione esto
      },
    ];
  },
};

export default nextConfig;
