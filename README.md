# Instrucciones de Ejecución

## Desarrollo

Si se desea ejecutar para la fase de desarrollo, puedes usar uno de los siguientes comandos:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

## Producción

Al ejecutar en producción, usa el siguiente comando:

```bash
docker compose up --build
```

Cabe mencionar que se está usando la versión 2 de Docker Compose, la cual no requiere el uso del comando `docker-compose`.
