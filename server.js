import {app} from './app.js';
import dotenv from 'dotenv';
import {connectDB} from "./db.js";
import Tour from "./model/tours.model.js";

// const app = express();
dotenv.config()

const port = process.env.PORT || 3000;
app.listen(port, () => {
    connectDB();
    console.log('App running on port ' + port)
})