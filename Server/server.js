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
    currentUser: 'guest',
    id: null
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

app.get('/api/data/tableNames', (req, res) => {
    sql.query('SELECT name FROM sys.tables')
    .then(result => res.json(result))
    .catch(error => {
        console.log(error);
        res.status(500).send("duck error in the server...");
    });
});

app.put('/api/data/tables', (req, res) => {
    const tableName = req.body.table;
    const rows = req.body.rows;
    console.log(`-------------------${tableName}`);
    console.log(`-------------------${rows}`);
    let query;
    if(rows === 'ALL') query = `SELECT * FROM [${tableName}]`;
    else query = `SELECT TOP ${rows} * FROM [${tableName}]`
    sql.query(query)
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
    
    if(user){ 
        state.currentUser = userName;
        state.id = user.EmployeeID;
        res.json(`login successful. Welcome ${state.currentUser} your id is:${state.id}`);
    }
    else {
        state.currentUser = 'guest';
        state.id = null;
        res.json('login failed');
    }
});

app.post('/api/signup', async function (req,res){
    req = req.body;
    const userName = req.userName.trim();
    const password = req.password.trim();
    
    let user = await sql.query(`SELECT * FROM logins WHERE UserName = '${userName}'`);
    user = user.recordset[0];
    
    if(user){ 
        res.json('this username is already taken...');
    }
    else if(userName === '' || password === ''){
        res.json('invalid username or password...');
    }
    else {
        sql.query(`INSERT INTO logins (UserName, Password) VALUES('${userName}','${password}')`);
        res.json('new user added...');
    }
});

app.listen(port, () => {
    connectToDB();
    console.log(`The server has started listening on port ${port}...`);
});
