# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Set environment variables (you can override with Kubernetes later)
ENV PORT=5000

EXPOSE 5000
CMD ["node", "server.js"]
