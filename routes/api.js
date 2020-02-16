const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const SECRET = "Lets934ieslfidshk4-dsgp94euihrdssle";
const cors = require('cors');
const { client, pool } = require('../db/db_config');
const jwt = require("jsonwebtoken");


router.post('/', verifyToken , async (req, res, next) => {
    const result = await pool.query('SELECT * FROM users');

    jwt.verify(req.token, SECRET, (err, authData) => {
        if (err) {
            res.json ({
                statusLock: '✋🏽',
                message: 'You are not authorised to access this resource'
            })
        } else {
            try {
                return res.json({
                    statusLock: '🔐',
                    data: result
                });
            } catch (error) {
                return next(error)
            }
        }

    })


});

router.post('/adduser', async (req, res,next) => {
    const {username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.query(`INSERT INTO users (username, password, email) VALUES ('${username}', '${hashedPassword}', '${email}');`);
        return res.json({
            lockStatus: '🔑',
            message: "User Saved",
        })
    } catch (error) {
        return res.json({
            lockStatus: "✋🏽",
            message: "You are not authorised!",
            error
        });
    }
});




router.post('/login', async (req, res, next) => {
    const {username, password} = req.body;

    try {
        const foundUser = await client.query(`SELECT * FROM users WHERE username='${username}' LIMIT 1;`);

        if (foundUser.rows.length === 0) {
            return res.json({
                lockStatus: "🔓",
                message: 'No account found with that username',
            });
        }

        const hashedPassword = await bcrypt.compare(
            password, foundUser.rows[0].password
        );

        if (hashedPassword === true) {

            const JWT = jwt.sign({
                username: foundUser.rows[0].username
            },
                SECRET, {
                expiresIn: 60 * 60
            });
        return res.json({
            lockStatus: "🔐",
            message: 'Passwords Match!',
            JWT
        });

        } else {
            return res.json({
                lockStatus: "✋🏽",
                message: 'Passwords did NOT Match!'
            });
        }
    } catch (error) {
        return res.json({
            lockStatus: "😭",
            message: "An Error?",
            error
        });
    }
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}



module.exports = router;