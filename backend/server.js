import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fs from 'fs';
dotenv.config();
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS for production
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Create uploads directory
const uploadsDir = path.join(path.resolve(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

// API routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Production setup
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  
  // Serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, 'frontend/build')));

  // Catch all handler for React routing
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
} else {
  // Development setup
  const __dirname = path.resolve();
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port, '0.0.0.0', () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);