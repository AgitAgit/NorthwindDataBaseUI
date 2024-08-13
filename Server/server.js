const sql = require('mssql');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const config = JSON.parse(fs.readFileSync('./config.txt','utf-8'));
const port = 5000;

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
