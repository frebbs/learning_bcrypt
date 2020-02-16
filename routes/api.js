const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { client, pool } = require('../db/db_config');

router.get('/', async (req, res, next) => {

    try {
        const result = await pool.query('SELECT * FROM users');
        return res.json(result.rows);
    } catch (error) {
        return next(error)
    }
});

router.post('/adduser', async(req, res,next) => {
    const {username, email, password} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await client.query(`INSERT INTO users (username, password, email) VALUES ('${username}', '${hashedPassword}', '${email}');`);
        return res.json({
            lockStatus: '🔑',
            message: "User Saved",
        })
    } catch (error) {
        return res.json({
            lockStatus: "😭",
            message: "User NOT Saved",
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

        console.log(hashedPassword);


        return res.json({
            lockStatus: "🔓",
            message: foundUser.rows,

        });
    } catch (error) {
        return res.json({
            lockStatus: "😭",
            message: "An Error?",
            error
        });
    }


});







module.exports = router;