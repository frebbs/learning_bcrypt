const express = require('express');
const app = express();
const apiRouter = require('./routes/api');
const membersRouter = require('./routes/members');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Env config

require('dotenv').config();
// Bring in the database querys


// Set the server port if ENV otherwise set to 3000
const PORT = process.env.SERVERPORT || 3000;

app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.use('/api', apiRouter);
app.use('/members', membersRouter);



// Actually run the server and listen on the ENV port and tell the user
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});