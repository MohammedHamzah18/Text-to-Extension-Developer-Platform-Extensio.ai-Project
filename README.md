# Extensio.ai – No-Code Browser Extension Factory

Production-ready SaaS platform to build **Chrome Extensions (Manifest V3)** from visual templates and configuration — **without any external AI APIs**.

## Features

- **JWT Authentication** – Register, login, protected routes, user profile
- **Extension Builder** – Visual forms driven by template schemas
- **Template Engine** – Placeholder replacement in `/server/templates`
- **Manifest V3 Generator** – Permissions, content scripts, service workers, icons
- **Code Validation** – JSON, manifest fields, MV3 compliance
- **Security Scanner** – Blocks eval, miners, exfiltration patterns
- **ZIP Packaging** – Archiver-based downloads with metadata in MongoDB
- **Monaco Preview** – Live file tree and syntax-highlighted source
- **Version Control** – Save, clone, restore, compare versions
- **Admin Dashboard** – Users, extensions, downloads, moderation

## Tech Stack

| Layer    | Stack                                      |
|----------|--------------------------------------------|
| Frontend | React, Tailwind, React Router, Context API |
| Backend  | Node.js, Express                           |
| Database | MongoDB                                    |
| ZIP      | archiver, fs                               |
| Deploy   | Docker Compose                             |

## Project Structure

```
client/          React SPA
server/          Express API
  src/
    controllers/
    routes/
    middleware/
    models/
    generators/    Template + manifest + file generation
    validators/
    zip/
  templates/     Extension source templates
```

## Quick Start (Local)

### Prerequisites

- Node.js 20+
- MongoDB 7+

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env` – set `JWT_SECRET` and `MONGODB_URI`.

### 3. Seed admin user (optional)

```bash
cd server && node scripts/seedAdmin.js
```

Default: `admin@extensio.ai` / `Admin123!@#`

### 4. Run development

```bash
# Terminal 1 – API
cd server && npm run dev

# Terminal 2 – UI
cd client && npm run dev
```

- Frontend: http://localhost:5173  
- API: http://localhost:5000  

## Docker Deployment

```bash
# Set a strong secret
export JWT_SECRET=your-long-random-secret

docker compose up --build -d
```

- App UI: http://localhost:5173  
- API: http://localhost:5000  

## Extension Templates

| Template ID      | Category          | Example use              |
|------------------|-------------------|--------------------------|
| image-blocker    | content-modifier  | Hide images, red placeholder |
| dark-mode        | utility           | Toggle dark theme        |
| text-replacer    | content-modifier  | Find/replace text        |
| website-blocker  | productivity      | Block distracting sites  |
| custom-css       | content-modifier  | Inject CSS               |
| bg-color         | content-modifier  | Change background        |
| pomodoro         | productivity      | Focus timer              |
| note-taking      | productivity      | Quick notes              |
| tab-counter      | utility           | Count open tabs          |
| qr-generator     | utility           | Page URL QR              |
| word-counter     | utility           | Word/char count          |

## API Overview

| Method | Endpoint                         | Description        |
|--------|----------------------------------|--------------------|
| POST   | `/api/auth/register`             | Register           |
| POST   | `/api/auth/login`                | Login              |
| GET    | `/api/extensions`                | List (search)      |
| POST   | `/api/extensions`                | Create             |
| GET    | `/api/extensions/:id/preview`    | Preview + validate |
| POST   | `/api/extensions/:id/generate`   | Build ZIP          |
| POST   | `/api/downloads/:extensionId`    | Track download     |
| GET    | `/api/admin/stats`               | Admin stats        |

## Security

- Helmet, rate limiting, mongo-sanitize, xss-clean
- JWT httpOnly cookies + Bearer header
- Pre-ZIP security pattern scan
- Input sanitization on settings

## Load Extension in Chrome

1. Generate and download ZIP from Extensio.ai  
2. Unzip to a folder  
3. Open `chrome://extensions` → Enable Developer mode  
4. **Load unpacked** → select the folder  

## License

MIT
