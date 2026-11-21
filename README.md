# Kanbanify

A Jira-like Kanban board that lives in your browser toolbar. Kanbanify is a Chrome extension (Manifest V3) to keep your notes and tasks tidy and organized in boards, columns, and cards — with drag and drop, colors, dark mode, and user accounts.

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
  - [1. Backend](#1-backend)
  - [2. React app](#2-react-app)
  - [3. Load the extension in Chrome](#3-load-the-extension-in-chrome)
- [Environment variables](#environment-variables)
- [API overview](#api-overview)

## Features

- Multiple boards with customizable columns (categories).
- Drag and drop cards between columns.
- Create, edit, and delete boards and entries, with custom colors.
- Light and dark themes.
- User accounts: register, email confirmation, login, and password recovery.
- Rate limiting on login and password-recovery endpoints.

## Tech stack

| Part | Technologies |
| --- | --- |
| Extension | Chrome Extension Manifest V3 |
| Frontend | React 18, TypeScript, Vite, Material UI, react-beautiful-dnd, React Router |
| Backend | Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, bcrypt, Nodemailer |

## Project structure

```text
.
├── backend/     # Express + MongoDB REST API (auth and user boards)
├── react/       # React app — the UI rendered inside the extension popup
└── extension/   # Chrome extension: manifest, icons, and the built React app
```

The React app is built and copied into `extension/`, which is the folder you load into Chrome.

## Getting started

### Prerequisites

- Node.js 18+
- Yarn (or npm)
- A MongoDB instance (local or Atlas)
- An SMTP account for confirmation and recovery emails

### 1. Backend

```sh
cd backend
cp .env.example .env   # fill in the values
yarn                   # or: npm install
yarn start             # or: npm start
```

The API listens on `http://localhost:8002`.

### 2. React app

```sh
cd react
cp .env.example .env   # set VITE_BASE_API, e.g. http://localhost:8002
yarn                   # or: npm install
```

Run it in the browser while developing:

```sh
yarn dev               # or: npm run dev
```

Build it and copy the output into the `extension/` folder:

```sh
yarn move              # or: npm run move
```

### 3. Load the extension in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `extension/` folder.

See the [official Chrome guide](https://support.google.com/chrome_webstore/answer/2664769?hl=en) for more details.

## Environment variables

**backend/.env**

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JSON Web Tokens |
| `AUTH_HOST` | SMTP host |
| `AUTH_PORT` | SMTP port |
| `AUTH_EMAIL` | SMTP user / sender address |
| `AUTH_PASSWORD` | SMTP password |

**react/.env**

| Variable | Description |
| --- | --- |
| `VITE_BASE_API` | Base URL of the backend API |

## API overview

All routes are prefixed with `/kanbanify/api`.

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/login`, `POST /auth/register`, `POST /auth/confirm`, `POST /auth/refresh`, `POST /auth/recovery/email`, `POST /auth/recovery` |
| Users | `GET`, `PATCH`, `DELETE /users/:id` — read, update, and delete the user's data and boards |

Authenticated requests send the token in the `x-token` header.
