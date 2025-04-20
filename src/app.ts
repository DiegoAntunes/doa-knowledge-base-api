import express from 'express';
import topicRoutes from './routes/topicRoutes';
import userRoutes from './routes/userRoutes';
import resourceRoutes from './routes/resourceRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use('/topics', topicRoutes);
app.use('/users', userRoutes);
app.use('/resources', resourceRoutes);
app.use(errorHandler); // global middleware

export default app;
