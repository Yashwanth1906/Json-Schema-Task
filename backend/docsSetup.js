import { google } from "googleapis";
import dotenv from "dotenv";


dotenv.config();

console.log(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS))
const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS
  ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  : require('./key.json');
console.log("crediantials : " + credentials)
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ["https://www.googleapis.com/auth/documents", "https://www.googleapis.com/auth/drive"],
});

export const docs = google.docs({version : "v1",auth});
export { auth };