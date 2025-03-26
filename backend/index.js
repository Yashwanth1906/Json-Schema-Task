import express from "express";
import { docRouter } from "./routes/docRoute.js";
import { tableContentRouter } from "./routes/tableContentRoute.js";
import { normalContentRouter } from "./routes/normalContentRoute.js";
import cors from "cors"
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api/doc", docRouter);
app.use("/api/table", tableContentRouter);
app.use("/api/normal", normalContentRouter);