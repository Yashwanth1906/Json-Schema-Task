import express from "express";
import { getAllRecords, initTable } from "../controllers/tableContent.js";

export const tableContentRouter = express.Router();

tableContentRouter.get("/get-all-records", getAllRecords);
tableContentRouter.get("/init-table",initTable);
