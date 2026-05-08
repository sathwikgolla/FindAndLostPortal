const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { connectDB } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { sanitizeRequest } = require("./middleware/sanitizeMiddleware");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const claimRoutes = require("./routes/claimRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

dotenv.config();

const app = express();

app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeRequest);

app.use(helmet());

app.use(
  cors({
    origin: (origin, cb) => {
      const allow = process.env.CLIENT_URL;
      if (!origin) return cb(null, true);
      if (!allow) return cb(null, true);
      const allowed = allow
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      // Allow exact matches and Vercel preview subdomains for configured Vercel app.
      if (allowed.includes(origin)) return cb(null, true);
      const vercelBase = allowed.find((x) => x.endsWith(".vercel.app"));
      if (vercelBase) {
        const escaped = vercelBase.replace(/\./g, "\\.").replace(/^https?:\/\//, "");
        const re = new RegExp(`^https:\\/\\/[a-z0-9-]+\\.${escaped}$`, "i");
        if (re.test(origin)) return cb(null, true);
      }
      return cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "FindAndLost API is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on port ${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
