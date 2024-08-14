//server members
const sql = require('mssql');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const config = JSON.parse(fs.readFileSync('./config.txt', 'utf-8'));
const port = 5000;

//client members
const state = {//use with primitives only!(only a shallow copy is sent to client...)
    currentUser: 'guest'
}


function connectToDB() {
    try {
        sql.connect(config);
        console.log('The server connected to the DB...');
    }
    catch (error) {
        console.log(`error connecting to db:${error}`);
    }
}


app.use(cors());
app.use(express.json());
app.get('/api/data/state', (req, res) => {
    res.json({ ...state });
});

app.get('/api/data/:tableName', (req, res) => {
    const { tableName } = req.params;
    sql.query(`SELECT TOP 20 * FROM ${tableName}`)
        .then(result => res.json(result))
        .catch(error => {
            console.log(error);
            res.status(500).send("duck error in the server...");
        });
});

app.post('/api/login', async function (req,res){
    req = req.body;
    const userName = req.userName;
    const password = req.password;

    let user = await sql.query(`SELECT * FROM logins WHERE UserName = '${userName}' AND Password = '${password}'`);
    user = user.recordset[0];
    
    if(user) res.json('login successful');
    else res.json('login failed');
});

app.listen(port, () => {
    connectToDB();
    console.log(`The server has started listening on port ${port}...`);
});
