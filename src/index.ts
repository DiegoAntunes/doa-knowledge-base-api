import express from 'express';
import topicRoutes from './routes/topicRoutes';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/topics', topicRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
