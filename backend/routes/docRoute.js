import express from "express";
import { setDocId } from "../controllers/docIDSetup.js";


export const docRouter = express.Router();

docRouter.post("/set-docId",setDocId);
