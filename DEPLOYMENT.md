# Extensio.ai Deployment Guide

## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `production` in deploy |
| `PORT` | API port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random secret (required) |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `CLIENT_URL` | Frontend origin for CORS |
| `UPLOAD_DIR` | Path for ZIP storage |
| `RATE_LIMIT_MAX` | Requests per window |

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL (default `/api` with proxy) |

## Docker Compose (Recommended)

1. Clone repository and set secrets:

```bash
export JWT_SECRET=$(openssl rand -hex 32)
```

2. Build and start:

```bash
docker compose up --build -d
```

3. Seed admin inside server container:

```bash
docker compose exec server node scripts/seedAdmin.js
```

## Manual Production

1. Build client:

```bash
cd client && npm ci && npm run build
```

2. Copy `client/dist` next to server or set `NODE_ENV=production` so Express serves static files.

3. Start server:

```bash
cd server && npm ci --omit=dev && NODE_ENV=production node src/index.js
```

## MongoDB Atlas

Set `MONGODB_URI` to your Atlas connection string. Whitelist deployment IP addresses.

## Reverse Proxy (Nginx)

- Terminate TLS at nginx  
- Proxy `/api` and `/storage` to Node  
- Serve `client/dist` for `/`  

Example upstream: `http://127.0.0.1:5000`

## Health Checks

- `GET /api/templates` – should return template list (no auth)  
- MongoDB must be reachable before server starts  

## Backups

- MongoDB: regular `mongodump`  
- `server/storage/zips`: volume backup if persisting downloads  

## Scaling Notes

- Run multiple API instances behind a load balancer  
- Use shared storage (S3/NFS) for `UPLOAD_DIR` if horizontally scaled  
- Sticky sessions not required (stateless JWT)  
