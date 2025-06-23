// import dotenv from 'dotenv';
// import cors from 'cors';

// dotenv.config();

// let corsMiddleware;

// try {
//   // Cấu hình CORS
//   const corsConfig = {
//     origin: (origin, callback) => {
//       // Danh sách các domain được phép (bao gồm localhost, production domain, và ngrok)
//       const allowedOrigins = [
//         'http://localhost:5173', // Dev frontend
//         process.env.CORS_ORIGIN, // Production domain
// /^https:\/\/[a-z0-9-]+\.ngrok-free\.app$/,
//       ];

//       // Nếu không có origin (ví dụ: request từ Postman, server-side), cho phép
//       if (!origin) return callback(null, true);

//       // Kiểm tra origin có trong danh sách allowed không
//       const isAllowed = allowedOrigins.some(allowed => {
//         if (typeof allowed === 'string') {
//           return origin === allowed;
//         } else if (allowed instanceof RegExp) {
//           return allowed.test(origin);
//         }
//         return false;
//       });

//       if (isAllowed) {
//         callback(null, true);
//       } else {
//         callback(new Error(`Origin ${origin} not allowed by CORS`));
//       }
//     },
//     methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
//     allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
//     credentials: true,
//     exposedHeaders: 'Content-Range,X-Content-Range,Authorization',
//     optionsSuccessStatus: 200,
//   };

//   console.log('CORS configuration loaded:', corsConfig);
//   corsMiddleware = cors(corsConfig);
// } catch (error) {
//   console.error('Error setting up CORS configuration:', error);
//   process.exit(1);
// }

// export default corsMiddleware;
//tạm thời bỏ