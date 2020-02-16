const {Pool, Client} = require('pg');

const pool = new Pool();

const client = new Client({
    connectionString: "postgresql://localhost/final_project"
});
client.connect();

module.exports = {pool, client};