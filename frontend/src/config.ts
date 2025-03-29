export const BACKEND_URL = import.meta.env.PROD 
  ? 'https://json-schema-task-backend.vercel.app'
  : 'http://localhost:3000'  // Development URL