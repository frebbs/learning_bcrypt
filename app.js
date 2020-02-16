const express = require('express');
const app = express();
const apiRouter = require('./routes/api');
const cors = require('cors');
// Env config

require('dotenv').config();
// Bring in the database querys


// Set the server port if ENV otherwise set to 3000
const PORT = process.env.SERVERPORT || 3000;

// Make some pretty colors on the console!
const chalk = require('chalk');

// Assign console.log to variable called Log for easy typing
const log = console.log;


// Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());



app.use('/api', apiRouter);



// Actually run the server and listen on the ENV port and tell the user
app.listen(PORT, () => {
    log(chalk.blue(`Server running on port: ${PORT}`));
});