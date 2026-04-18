FROM node:20-alpine AS build
WORKDIR /app

# Copiar dependencias primero (mejor caché de capas)
COPY package.json ./
RUN npm install

# Declarar la variable de build ANTES de copiar el código
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copiar TODO el código fuente (incluyendo Footer.jsx y Layout.jsx)
COPY . .

# Construir la aplicación
RUN npm run build

# ── Imagen final ligera solo con los estáticos ──────────
FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]