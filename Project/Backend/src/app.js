import express from "express"
import cors from "cors"
import projectRouter from "./routes/project.routes.js"
import { createRateLimiter, securityHeaders } from "./middleware/security.middleware.js"

const app = express()

app.use(securityHeaders)

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:8000",
    credentials: true
}))

// Increased limits for JSON/URL-encoded bodies (file uploads are handled by multer)
app.use(express.json({
    limit: "10mb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "10mb"
}))

app.use(express.static("public"))

// Health check
app.get("/", (req, res) => {
    res.send("Hello world!")
})

// Debug middleware for API calls (before routes to log all requests)
app.use("/api/v1", (req, res, next) => {
    console.log(`API call: ${req.method} ${req.originalUrl}`);
    next();
});

// API routes
app.use("/api/v1", createRateLimiter({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 60,
}))
app.use("/api/v1", projectRouter)

export { app }
