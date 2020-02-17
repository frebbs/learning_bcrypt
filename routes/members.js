const express = require('express');
const router = express.Router();
const SECRET = "Lets934ieslfidshk4-dsgp94euihrdssle";
const { client, pool } = require('../db/db_config');

const jwt = require("jsonwebtoken");




router.get('/', (req, res) => {
    res.render('members/login', {
        lockStatus: '🔓'
    })
});

router.get('/signup', (req, res) => {
    res.render('members/signup')
});

router.get('/profile', async (req, res) => {

    if (req.cookies.access_token) {
        const loggedIn = jwt.verify(req.cookies.access_token, SECRET);
        const foundUser = await client.query(`SELECT * FROM users WHERE username='${loggedIn.username}' LIMIT 1;`);
        res.json({
                lockStatus: '🔐',
                Message: "Secure Information here",
                sessionDetails: req.cookies,
                loggedIn,
                foundUser: foundUser.rows
            }
        );
    }
    else {
        res.json({
            lockStatus: '✋',
            message: 'Now allowed'
        })
    }
});


router.get('/home', (req, res, next) => {

    if(req.cookies.access_token) {
        const loggedIn = jwt.verify(req.cookies.access_token, SECRET);
        res.render('members/index', {
            loggedIn: loggedIn.username
        });
    }
    else {
        res.json({
            lockStatus: '✋🏽',
            message: 'You are not signed in!'
        })
    }
});

router.get('/editprofile', async (req, res) => {

    if(!req.cookies.access_token) {
        res.json({
            message: "You need to be logged in to view this page"
        })
    } else if (req.cookies.access_token){

        const loggedIn = jwt.verify(req.cookies.access_token, SECRET);

        const foundUser = await client.query(`SELECT * FROM users WHERE username='${loggedIn.username}' LIMIT 1;`);

        console.log(foundUser.rows[0].username);
        res.render('members/editprofile', {
            loggedInUser: foundUser.rows[0]
        })
    } else {
        res.sendStatus(403).json({
            lockStatus: '✋🏽',
            message: 'Forbidden'
        });
    }

});





module.exports = router;