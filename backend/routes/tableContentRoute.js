import express from "express";
import { getAllRecords, initTable, addRecord, updateRecord, deleteRecord, checkTableInited } from "../controllers/tableContent.js";

export const tableContentRouter = express.Router();
tableContentRouter.get("/get-all-records", getAllRecords);
tableContentRouter.get("/init-table",initTable);
tableContentRouter.post("/add-record",addRecord);
tableContentRouter.post("/update-record",updateRecord);
tableContentRouter.post("/delete-record",deleteRecord);
tableContentRouter.get("/is-table-inited",checkTableInited)
