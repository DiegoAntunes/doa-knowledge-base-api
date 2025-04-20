import express from 'express';
import topicRoutes from './routes/topicRoutes';
import userRoutes from './routes/userRoutes';
import resourceRoutes from './routes/resourceRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { fakeAuthMiddleware } from './middlewares/fakeAuthMiddleware';


const app = express();

app.use(express.json());
app.use(fakeAuthMiddleware); 
app.use('/topics', topicRoutes);
app.use('/users', userRoutes);
app.use('/resources', resourceRoutes);
app.use(errorHandler); // global middleware

export default app;
