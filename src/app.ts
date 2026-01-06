// /**
//  * Express Application Setup
//  */

// import 'reflect-metadata';
// import express, { Application } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import dotenv from 'dotenv';
// import profileRoutes from './routes/profileRoutes';
// import authRoutes from './routes/authRoutes';
// import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
// import path from 'path';
// import fs from 'fs';

// // Load environment variables
// dotenv.config();

// const app: Application = express();

// // Security middleware
// app.use(helmet());

// // CORS configuration
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN || '*',
//     credentials: true,
//   })
// );

// // Body parsing middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve uploaded files statically
// const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }
// console.log('Upload directory:', uploadDir);
// app.use('/uploads', express.static(uploadDir));

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//   });
// });

// // API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/profile', profileRoutes);

// // 404 handler (must be after all routes)
// app.use(notFoundHandler);

// // Error handler (must be last)
// app.use(errorHandler);

// export default app;


import { mintEgg } from "./test/mintEgg"; 

mintEgg();