# Also There – Admin SaaS (Frontend)

Aplicación web SaaS multi-tenant para gestión administrativa (tipo QuickBooks) de **Also There**.

## Requisitos

- Node 18+
- npm

## Instalación y ejecución local

```bash
npm install
npm run dev
```

La app estará disponible típicamente en `http://localhost:5173`.

## Scripts

- `npm run dev` – entorno de desarrollo.
- `npm run build` – build de producción.
- `npm run preview` – previsualizar build.
- `npm run lint` – ESLint.
- `npm run test` – tests con Vitest.

## Deploy en AWS Amplify

1. Crea una app en AWS Amplify y conecta este repositorio.
2. Amplify detectará automáticamente `amplify.yml` en la raíz con:
   - `npm ci`
   - `npm run build`
   - Directorio de artefactos: `dist`.
3. Configura las variables de entorno necesarias (por ejemplo, `VITE_API_BASE_URL` futuro backend).

### Reglas de reescritura SPA

Para que React Router funcione correctamente:

- En la sección de **Rewrites and redirects** añade una regla:
  - Source address: `</^((?!.well-known).*)$/>`
  - Target address: `/index.html`
  - Type: `200 (Rewrite)`

Esto asegura que cualquier ruta de la SPA (por ejemplo `/app/clients/123`) sirva `index.html`.

## TODO para backend real

- Reemplazar la capa de mocks en `src/services/mockDb.ts` y servicios de dominio por llamadas a una API real usando `fetch` o cliente HTTP.
- Usar cookies `httpOnly` para el token de sesión una vez exista backend.

