import express from "express";
import http from "http";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors, { CorsOptions } from "cors";
import checkJSON from "./middlewares/checkJSON";

// Express Configuration
const app = express();

/**
 * CORS Options
 */
const corsOptions: CorsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
  ],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Logger Configuration
app.use(process.env.PRODUCTION ? logger("combined") : logger("dev"));

// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("public")));
app.use(checkJSON);

// Server Configuration
const server = http.createServer(app);
const port = Number(process.env.PORT) || 8000;

// Index Router Import
import indexRouter from "./indexRouter";

// Index Router Setup
app.use("/", indexRouter); // Other routes are within the indexRouter

// Error Handler Middleware
import errorHandler from "./middlewares/errorHandler";
app.use(errorHandler);

// Start Server
server.listen(port, () => {
  console.log("Server listening on port " + port);
});

// MongoDB Connection
import connectDB from "./configs/dbConfig";
connectDB();

/**
 * Function to Gracefully close the server on process termination.
 */
const closeServer = () => {
  server.close(() => {
    console.log("\nProcess terminated, closing server.");
    process.exit(0);
  });
};

// Close server on process termination
process.on("SIGINT", closeServer);
process.on("SIGTERM", closeServer);
process.once("SIGUSR2", closeServer);
