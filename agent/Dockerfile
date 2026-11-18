# Draft voice agent for LiveKit Cloud (lk agent create / lk agent deploy).
FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx tsx src/agent.ts download-files || true
USER node
CMD ["npx", "tsx", "src/agent.ts", "start"]
