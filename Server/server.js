const sql = require('mssql');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./config.txt','utf-8'));


async function queryDatabase() {
    try {
        await sql.connect(config);

        const result = await sql.query`SELECT * FROM employees`;
        console.log(result.recordset);

    } catch (err) {
        console.error(err);
    } finally {
        sql.close();
    }
}

queryDatabase();