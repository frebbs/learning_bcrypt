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
        const result = await client.query(`INSERT INTO users (username, password, email) VALUES ('${username}', '${hashedPassword}', '${email}') RETURNING *;`);
        return res.json({
            lockStatus: '🔑',
            message: "User Saved",
            userDetails: result.rows[0]
        })
    } catch (error) {
        return next(error)
    }
});


router.post('/login', (req, res) => {

    const {email, password} = req.body;


});







module.exports = router;