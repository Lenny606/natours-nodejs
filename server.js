import {app} from './app.js';
import dotenv from 'dotenv';
import {connectDB} from "./db.js";
import Tour from "./model/tours.model.js";

// const app = express();
dotenv.config()

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    connectDB();
    console.log('App running on port ' + port)
})
//unhandled error outside of express (DB for example), shut down gracefully
process.on('unhandledRejection', err => {
    console.log(err.name, err.message)
    console.log('Unhandled rejection... Shuting down ...')
    server.close(() => {
        process.exit(1)

    })
})