# Prototipo Scribd (MVP) - Entrega para Héctor

Este repositorio contiene un prototipo mínimo funcional para presentación de avance.
Tecnologías: Next.js (TypeScript), Supabase (Auth, Storage, Postgres), PDF.js (visor).

**Importante**: Este proyecto no contiene claves. Antes de ejecutar configura variables en `.env.local`.

## Pasos rápidos (para quien despliegue)
1. Crear proyecto en Supabase y crear bucket `documents` en Storage (public for demo).
2. Crear tablas ejecutando `sql/schema.sql` en SQL editor de Supabase.
3. Crear archivo `.env.local` con las variables (ver abajo).
4. Subir a GitHub o desplegar en Vercel y configurar variables de entorno en el dashboard.

## Variables de entorno (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key - SOLO EN SERVER>

## Comandos
npm install
npm run dev

## Notas
- Para producción no uses keys en frontend; mantén el service role en funciones de servidor seguras.
- Política de derechos de autor y moderación necesaria antes de abrir al público.
