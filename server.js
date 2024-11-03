import express, { json } from "express";
import cors from "cors"; // Import the cors package

const app = express();

import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import multer from "multer";
import session from "express-session";
const upload = multer({ dest: "uploads/" });
import errorHandler from "./middlewares/errorHandler.js";
import { connectToDatabase } from "./config/squeelizeDbConfig.js";
// ===========================================
const serverEnv = process.env.NODE_ENV || "dev";
const port = process.env.PORT || 3000;
//
// Middleware to parse JSON bodies
app.use(json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// connectDB();
connectToDatabase();
// Use CORS middleware
app.use(cors()); // Allows all origins by default

// Define a port
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

/**
 * Sanitize MongoDB request
 */
app.use(mongoSanitize());
//
// const sess = {
//   secret: config.get("security.secret"),
//   cookie: {},
//   store: MongoStore.create({
//     autoRemove: "interval",
//     autoRemoveInterval: 10, // In minutes. Default
//     collection: "sessions",
//     mongoUrl: Core.getConnectionString(),
//   }),
//   resave: true,
//   saveUninitialized: true,
// };
// if (serverEnv === "production") {
//   // Compression

//   // Sessions
//   app.set("trust proxy", 1); // trust first proxy
//   sess.cookie.secure = config.get("server.sslEnabled"); // serve secure cookies
// }
// //
// app.use(session(sess));

// REAL ROUTESS

app.use("/api/users", userRoutes);

// =========================
app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on the server`);
  err.status = "fail";
  err.errorCode = 404;
  err.message = "API route not found!";
  next(err);
});

app.use(errorHandler); // Use the error handler as the last middleware
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
