import express from "express";
import { insertEntry, updateStatus, getAllRecords, writeContent } from "../controllers/handlers.js";


export const apiRouter = express.Router();

apiRouter.post("/insert-entry", insertEntry);
apiRouter.post("/update-certificate-status", updateStatus);
apiRouter.get("/get-all-records", getAllRecords);
apiRouter.post("/write-content", writeContent);