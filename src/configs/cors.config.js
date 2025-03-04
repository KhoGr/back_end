
///////////////////////////////////////////////////////

import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

let corsMiddleware; // Khai báo biến bên ngoài

try {
  // Cấu hình CORS
  const corsConfig = {
    origin:
      process.env.NODE_ENV !== 'production'
        ? 'http://localhost:8888'
        : process.env.CORS_ORIGIN,
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
    credentials: true,
    exposedHeaders: 'Content-Range,X-Content-Range,Authorization',
    optionsSuccessStatus: 200,
  };

  console.log('CORS configuration loaded:', corsConfig);

  corsMiddleware = cors(corsConfig); 
} catch (error) {
  console.error('Error setting up CORS configuration:', error);
  process.exit(1); 
}

export default corsMiddleware; 
