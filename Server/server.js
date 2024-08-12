const sql = require('mssql');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const config = JSON.parse(fs.readFileSync('./config.txt','utf-8'));
const port = 5000;

const querys = [`SELECT * FROM orders WHERE shipCountry = 'USA'`,
                `SELECT productName, unitPrice + 9, categoryID FROM products WHERE productName LIKE '%C%'`,
                `SELECT categoryID, categoryName, description FROM categories WHERE categoryID > 3 ORDER BY categoryID DESC`];

async function queryDatabase() {
    try {
        await sql.connect(config);

        const result = await sql.query(querys[querys.length - 1]);
        //console.log(result.recordset);

    } catch (err) {
        console.error(err);
    } finally {
        sql.close();
    }
}

app.use(cors());
app.use(express.json());
app.use('/api', routes);

queryDatabase();