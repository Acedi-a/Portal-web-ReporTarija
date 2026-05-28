# Panel ReportaTarija

Portal web municipal para gestionar reportes ciudadanos de Tarija.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form + Zod
- Lucide React
- Recharts
- InsForge como BaaS

## Comandos

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

## InsForge

La conexion del frontend esta centralizada en:

```txt
src/lib/insforge.ts
```

Variables esperadas:

```env
VITE_INSFORGE_URL=https://pxbe3x64.us-east.insforge.app
VITE_INSFORGE_ANON_KEY=tu_anon_key
```

El esquema y datos demo estan versionados en:

```txt
database/insforge-schema-seed.sql
```

Ese archivo crea las tablas principales, indices, trigger de notificaciones y datos demo para areas, categorias, funcionarios, reportes, evidencias, tracking y notificaciones.
