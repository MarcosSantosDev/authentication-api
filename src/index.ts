import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import './database/connect';
import routes from './routes';

const app = express();
const PORT = 4000

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
