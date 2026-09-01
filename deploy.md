# SSIH (Smart Student Information Hub) — Deployment Guide

This guide provides end-to-end instructions for deploying **SSIH** to production environments securely and reliably.

---

## 1. Pre-Deployment Security & Integrity Checklist

Before pushing to any public or private repository:

- [x] **`.gitignore` Verified**: Ensure that `node_modules/`, `.env`, `.env.*`, and database runtime states (`server/data/`, `*.sqlite`, `*.db`) are ignored.
- [x] **Environment Variables Isolated**: Do not hardcode JWT secrets or sensitive keys in source files. Use `server/.env.example` as a template.
- [x] **Production Static Assets**: Run `npm run build` inside `/client` to generate the minified bundle in `client/dist`.

---

## 2. Recommended Deployment Options

### Option A: Unified Full-Stack Deployment on Render / Railway (Recommended)

In this configuration, Express serves both the REST API and the React single-page application from a single service.

#### 1. Setup on Render (Web Service)
1. Push your code to GitHub.
2. Log into [Render Dashboard](https://dashboard.render.com/) and click **New + $\rightarrow$ Web Service**.
3. Connect your repository.
4. Configure the following build settings:
   - **Environment**: `Node`
   - **Build Command**:
     ```bash
     npm install && cd client && npm install && npm run build && cd ../server && npm install
     ```
   - **Start Command**:
     ```bash
     cd server && npm start
     ```
5. In the **Environment Variables** tab, add:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (or leave default for Render)
   - `JWT_SECRET` = `[Generate a secure 64-character random string]`
6. Click **Deploy Web Service**.

---

### Option B: Separate Frontend (Vercel) + Backend (Render / Railway)

#### 1. Backend on Render / Railway
1. Set the root directory to `server`.
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `JWT_SECRET` = `[Your Secret]`
5. Note down your backend URL: e.g. `https://ssih-backend.onrender.com`.

#### 2. Frontend on Vercel
1. Import your repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Set **Framework Preset** to `Vite`.
4. Create a `client/vercel.json` rewrite file to forward API calls to your live backend:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://ssih-backend.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
5. Click **Deploy**.

---

## 3. Production Deployment with Docker

### `Dockerfile` (Unified Multi-Stage Build)
Save this as `Dockerfile` in the root directory:

```dockerfile
# Stage 1: Build Frontend
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup Server & Final Runtime
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install --production
COPY server/ ./server/
COPY --from=client-builder /app/client/dist ./client/dist

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

CMD ["node", "server/src/server.js"]
```

### Run with Docker:
```bash
# Build image
docker build -t ssih-hub:latest .

# Run container
docker run -d -p 5000:5000 --name ssih-app -e JWT_SECRET="your_production_secret" ssih-hub:latest
```

---

## 4. Local Production Test Command

To test the exact production build locally:

```bash
# 1. Build client bundle
cd client
npm run build

# 2. Start server in production mode
cd ../server
set NODE_ENV=production  # On Linux/Mac: export NODE_ENV=production
node src/server.js
```
Open `http://localhost:5000` in your browser. Express will automatically serve the production Vite bundle.
