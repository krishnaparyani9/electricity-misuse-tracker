# Electricity Misuse Tracker

Monorepo for reporting electricity misuse in a shared flat and assigning fines.

## Stack
- `frontend` - React + Vite + Tailwind CSS + TypeScript
- `backend` - Node.js + Express + MongoDB

## Local setup

### Backend
Create `backend/.env` with:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/electricity_misuse_tracker
CORS_ORIGIN=http://localhost:5173
UPLOAD_DIR=uploads
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=electricity-misuse-tracker
```

Install and run:

```bash
cd backend
npm install
npm run dev
```

### Frontend
Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000
```

Install and run:

```bash
cd frontend
npm install
npm run dev
```

## Deployment

### Backend
Deploy the `backend` folder to a Node host such as Render or Railway.

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Required environment variables:

```env
MONGODB_URI=<your-mongodb-atlas-uri>
CORS_ORIGIN=<your-frontend-url>
PORT=5000
UPLOAD_DIR=uploads
CLOUDINARY_CLOUD_NAME=<optional>
CLOUDINARY_API_KEY=<optional>
CLOUDINARY_API_SECRET=<optional>
CLOUDINARY_FOLDER=electricity-misuse-tracker
```

If your frontend is hosted on more than one origin, set `CORS_ORIGIN` as a comma-separated list.
If the Cloudinary variables are set, image uploads go to Cloudinary. If they are omitted, uploads fall back to the backend filesystem.

### Frontend
Deploy the `frontend` folder to a static host such as Vercel or Netlify.

- Build command: `npm install && npm run build`
- Output directory: `dist`
- Required environment variable:

```env
VITE_API_URL=<your-backend-url>
```

Example:

```env
VITE_API_URL=https://your-backend.onrender.com
```

## Production note

Reports are now stored in MongoDB. Uploaded images can be stored in Cloudinary or on the backend filesystem.

- uploaded files may be lost on hosts with ephemeral disk storage

For a durable hosted deployment, set the Cloudinary environment variables so images do not depend on local disk.
