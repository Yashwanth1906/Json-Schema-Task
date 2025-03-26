import express from "express";
import { apiRouter } from "./routes/apiRoutes.js";
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api", apiRouter);