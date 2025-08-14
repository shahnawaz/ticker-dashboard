FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY next.config.mjs tsconfig.json ./
COPY postcss.config.js tailwind.config.ts ./
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY public ./public
COPY app/globals.css ./app/globals.css
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV PORT=3000
COPY --from=build /app .
EXPOSE 3000
CMD ["npm", "start"]
