import {app} from './app.js';
import dotenv from 'dotenv';

// const app = express();
dotenv.config()

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('App running on port ' + port)
})