const sql = require('mssql');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const config = JSON.parse(fs.readFileSync('./config.txt','utf-8'));
const port = 5000;

const querys = [`SELECT * FROM orders WHERE shipCountry = 'USA'`,
                `SELECT productName, unitPrice + 9, categoryID FROM products WHERE productName LIKE '%C%'`,
                `SELECT categoryID, categoryName, description FROM categories WHERE categoryID > 3 ORDER BY categoryID DESC`,
                `SELECT COUNT(*) as COUNT, SUM(freight) as SUM, MIN(freight) as MIN, MAX(freight) as MAX, AVG(freight) as AVG FROM orders`
            ];

async function queryDatabase() {
    try {
        await sql.connect(config);

        const result = await sql.query(querys[querys.length - 1]);
        console.log(result.recordset);

    } catch (err) {
        console.error(err);
    } finally {
        sql.close();
    }
}

app.use(cors());
app.use(express.json());
app.get('/api/data/:tableName', (req, res) => {
    console.log(req);
    const { tableName } = req.params;
    sql.query(`SELECT TOP 20 * FROM ${tableName}`)
    .then(result => res.json(result))
    .catch(error => {
        console.log(error);
        res.status(500).send("duck error in the server...");
    });
});
app.get('/api/data/')
// app.use('/api', routes); TODO: add a routing file

function connectToDB(){
    try{
        sql.connect(config);
        console.log('The server connected to the DB...');
    }
    catch(error){
        console.log(`error connecting to db:${error}`);
    }
}
app.listen(port,()=>{
    connectToDB();
    console.log(`The server has started listening on port ${port}...`);
});


queryDatabase();