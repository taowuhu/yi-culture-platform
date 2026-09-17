import express from 'express';
import retrieval from './retrieval';

const app = express();
app.use(express.json());
app.use('/api/iching', retrieval);

app.listen(3001, () => console.log('Server 3001'));
