FROM node:20.14.0-alpine AS builder
ENV NODE_ENV=development
WORKDIR /app
COPY ./app/package.json ./
COPY ./app/prisma ./prisma
RUN npm install
RUN npx prisma generate
COPY ./app/ .
RUN npm run build

FROM node:20.14.0-alpine AS runner
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY ./app/package.json ./
COPY ./app/prisma ./prisma
COPY ./app/start.sh ./
RUN npm install
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/google-cloud/reading-record-425713-43505c9f19a2.json ./src/google-cloud/reading-record-425713-43505c9f19a2.json
RUN chmod +x ./start.sh
CMD ["./start.sh"]
