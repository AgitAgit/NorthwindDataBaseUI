//general elements
const serverPath = 'http://localhost:5000';
const fullPath = window.location.pathname;
const pageName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
const _loggedUser = document.getElementById('loggedUser');

const _state = {
    currentPage : pageName,
    currentUser : 'guest',
    id: null,
    refreshView : function(){
        _loggedUser.textContent = `Hello ${this.currentUser}`;
    }
};

//index elements
let _searchBtn;
let _mainTable;
let _inputSearch;
let _selectOption;

//login elements
let _inputUserName;
let _inputPass = document.getElementById('inputPass');

updateLocalState();
function updateLocalState(currentUser,id){
    if(currentUser) _state.currentUser = currentUser;
    _state.id = id;
    if(_state.currentPage === 'index.html'){
        _searchBtn = document.getElementById('searchBtn');
        _inputSearch = document.getElementById('inputSearch');
        _mainTable = document.getElementById('main-table');
        _selectOption = document.getElementById('selectOption');
        
        fillOptions(_selectOption, _inputSearch);
        _searchBtn.addEventListener('click', handleSearchClick);
    }
    else if(_state.currentPage === 'login.html'){
        _inputUserName = document.getElementById('inputUserName');
        _inputPass = document.getElementById('inputPass');

    }    
    _state.refreshView();
    console.log("current local state is:", _state);
}

function getState(){
    fetch(`${serverPath}/api/data/state`)
    .then(response => response.json())
    .then(state => {
        updateLocalState(state.currentUser, state.id);
    })
    .catch(error => console.log(error));
}

function checkLogin(){
    const user = _inputUserName.value;    
    const pass = _inputPass.value;
    console.log("user",user);
    console.log("pass", pass);
    fetch(`${serverPath}/api/login`,{
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            userName: user,
            password: pass
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        getState();
    })
    .catch(error => console.log(error));
}


function fillOptions(selectElement, inputElement, searchBtn){
    fetch(`${serverPath}/api/data/tableNames`)
    .then(response => response.json())
    .then(data => {
        console.log(data.recordset);
        
        selectElement.addEventListener('change',()=>{
            inputElement.value = selectElement.value;
            handleSearchClick();
        });

        for(let i = 0; i < data.recordset.length; i++){
            console.log(data.recordset[i].name);
            const option = document.createElement('option');
            option.textContent = data.recordset[i].name;
            selectElement.appendChild(option);
        }
    })
    .catch(error => console.log(error));
}

function signup(){
    const user = _inputUserName.value;    
    const pass = _inputPass.value;
    console.log("user",user);
    console.log("pass", pass);
    fetch(`${serverPath}/api/signup`,{
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            userName: user,
            password: pass
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.log(error));
}


function getData(){
    const tableName = _inputSearch.value.trim();
    if(tableName === '' || tableName === null) return;
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
    if(!data) return;

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

getState();