import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vice City',
  description: 'Sistema de reservas Vice City',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
