import express from "express";
import { insertEntry, updateStatus, getAllRecords } from "../controllers/handlers";


export const apiRouter = express.Router();

apiRouter.post("/insert-entry", insertEntry);
apiRouter.post("/update-certificate-status", updateStatus);
apiRouter.get("/get-all-records", getAllRecords);
