import express from "express";
import { docRouter } from "./routes/docRoute.js";
import { tableContentRouter } from "./routes/tableContentRoute.js";
import { normalContentRouter } from "./routes/normalContentRoute.js";
import cors from "cors"

/// This logic is for vercel deployment
const keyFilePath = "/tmp/key.json";

// Write the credentials to key.json if not already present
if (process.env.GOOGLE_CREDENTIALS) {
  fs.writeFileSync(keyFilePath, process.env.GOOGLE_CREDENTIALS);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;
}
// This logic is for vercel deployment

const app = express();
app.use(express.json());
app.use(cors({
  allowCredentials: true,
  origin: ["http://localhost:5173", "https://json-schema-task-frontend.vercel.app/"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  credentials: true,
  maxAge: 86400,
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api/doc", docRouter);
app.use("/api/table", tableContentRouter);
app.use("/api/normal", normalContentRouter);