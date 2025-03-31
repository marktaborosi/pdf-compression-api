import express from 'express';
import dotenv from 'dotenv';
import compressRoute from './routes/compress';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/compress', compressRoute);
app.get('/health', (req, res) => {
    res.status(200).send('ok');
});

export default app;
