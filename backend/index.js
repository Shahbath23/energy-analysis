
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import designRoutes from './routes/designRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import cors from "cors"

dotenv.config();

const app = express();
const port = process.env.PORT || 3090;

// Middleware
app.use(express.json());
app.use(cors());


// MongoDB Connection
connectDB();

// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} - ${req.ip} - ${req.url}`);
    next();
});




// Routes
app.use('/api/designs', designRoutes);
app.use('/api/analysis', analysisRoutes);

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});