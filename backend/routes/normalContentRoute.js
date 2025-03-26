import express from "express";
import { addEntry, updateEntry, deleteEntry } from "../controllers/normalContent.js";

export const normalContentRouter = express.Router();

normalContentRouter.post("/add-entry",addEntry);
normalContentRouter.post("/update-entry",updateEntry);
normalContentRouter.post("/delete-entry",deleteEntry);
