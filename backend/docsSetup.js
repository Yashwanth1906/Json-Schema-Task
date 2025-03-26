import { google } from "googleapis";
import dotenv from "dotenv";


dotenv.config();


const auth = new google.auth.GoogleAuth({
   keyFile : process.env.GOOGLE_APPLICATON_CREDENTIALS,
   scopes : ["https://www.googleapis.com/auth/documents", "https://www.googleapis.com/auth/drive"],
});

export const docs = google.docs({version : "v1",auth});