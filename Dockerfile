FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

# Variable de build inyectada desde Railway → Variables de entorno del proyecto
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# ── Imagen final ──────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3000

# --single redirige TODAS las rutas a index.html (necesario para React Router)
CMD ["sh", "-c", "serve --single dist -l ${PORT:-3000}"]
