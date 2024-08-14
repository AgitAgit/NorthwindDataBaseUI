//general elements
const serverPath = 'http://localhost:5000';
const _loggedUser = document.getElementById('loggedUser');
const _state = {
    currentPage : 'index',
    currentUser : 'guest',
    refreshView : function(){
        _loggedUser.textContent = `Hello ${this.currentUser}`;
    }
};

//index elements
let _searchBtn;
let _mainTable;
let _inputSearch;

//login elements
let _inputUserName;
let _inputPass = document.getElementById('inputPass');


function updateState(currentPage, currentUser){
    if(currentPage) _state.currentPage = currentPage;
    if(currentUser) _state.currentUser = currentUser;
    if(_state.currentPage === 'index'){
        _searchBtn.addEventListener('click', handleSearchClick);
    }
    else if(_state.currentPage === 'login'){
        _inputUserName = document.getElementById('inputUserName');
        _inputPass = document.getElementById('inputPass');

    }    
    _state.refreshView();
}

function getData(){
    const tableName = _inputSearch.value;
    return fetch(`${serverPath}/api/data/${tableName}`, {
        headers: {
            "Content-Type":"application/json"
        },
        method: "GET"
    })
    .then(response => response.json())
    .catch(error => console.log(error));
}

async function handleSearchClick(){
    const data = await getData();
    // console.log(data);
    displayTable(data);
}

function displayTable(data){
    _mainTable.innerHTML = ''; //remove previous table 
    const rows = data.recordset;
    // console.log(rows);
    const numOfCols = Object.keys(rows[0]).length;

    const tableHead = document.createElement("tr");
    _mainTable.appendChild(tableHead);
    _mainTable.style.visibility = 'visible';

    for(const [key,value] of Object.entries(rows[0])){
        const col = document.createElement("th");
        col.textContent = key;
        tableHead.appendChild(col);
    }

    for(let i=0;i<rows.length;i++){
        const tableRow = document.createElement("tr");
        _mainTable.appendChild(tableRow);
        for(const [key,value] of Object.entries(rows[i])){
            const cell = document.createElement("td");
            cell.textContent = value;
            tableRow.appendChild(cell);
        }
    }
}

function checkLogin(){
    const user = _inputUserName.value;    
    const pass = _inputPass.value;
    fetch(`${serverPath}/api/data/Logins`, {
        headers: {
            "Content-Type":"application/json"
        },
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        const users = data.recordset;
        
        for(let i=0;i<users.length;i++){
            if(users[i].UserName === user && users[i].Password === pass){
                _isLoggedIn = true;                 
                break;
            }
        }
    })
    .catch(error => console.log(error));
}
