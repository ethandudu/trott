import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// ROUTES
import authRoutes from './routes/auth';
import positionRoutes from './routes/position';

// MIDDLEWARES
import { authMiddleware } from './middlewares/authMiddleware';
import { apiKeyAuth } from './middlewares/apiKeyAuthMiddleware';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', positionRoutes);

// /ping route
app.get('/ping', (_, res) => {
  res.json({ message: 'pong' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
