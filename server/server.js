
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import connectToDb from "./utils/db.js";
import authRoutes from "./routes/auth.routes.js";
import contactRoute from "./routes/contact.routes.js";
import adminRouter from "./routes/admin.routes.js";
import exhibitorRoutes from "./routes/exhibitor.routes.js";
import boothRoutes from "./routes/booth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import adminApplicationRoutes from "./routes/admin.application.routes.js";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Server configuration
const app = express();
const PORT = process.env.PORT || 5000;
const URI = process.env.MONGODB_URI;

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/form", contactRoute);
app.use("/api/admin", adminRouter);
app.use("/api/events", sessionRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/exhibitor", exhibitorRoutes);
app.use("/api/admin", adminApplicationRoutes);
app.use("/api", boothRoutes);

// Error middleware
app.use(errorMiddleware);

// Server startup
const startServer = async () => {
  try {
    await connectToDb(URI);

    app.listen(PORT, () => {
      console.log(`Server Is Running At Port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
