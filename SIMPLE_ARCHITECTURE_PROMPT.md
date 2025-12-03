# SIMPLE SYSTEM ARCHITECTURE PROMPT

Create a system architecture diagram for a Virtual 3D Interior Design Platform with the following layers:

## Components:

**Frontend (Client)**
- React + Three.js (3D rendering)
- Axios (API calls)
- Tailwind CSS (UI)

**Backend (Server)**
- Node.js + Express (REST API)
- JWT Authentication
- Middleware (Security, Validation, Rate Limiting)

**Database**
- MongoDB (User, Project, Design, Furniture, Template, DesignFile models)

**External Services**
- Cloudinary (File storage)
- Stripe (Payments)
- AI Services (Design tools)

## Data Flow:
```
User → React Frontend → Express API → MongoDB
Files → Multer → Cloudinary
3D Rendering → Three.js (Client-side)
```

## Color Scheme:
- Blue: Frontend
- Green: Backend  
- Orange: Database
- Purple: External Services

## Diagram Style:
- Show clear separation between layers
- Use arrows to show data flow direction
- Keep it simple and easy to understand



