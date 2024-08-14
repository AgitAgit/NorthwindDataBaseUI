const serverPath = 'http://localhost:5000';
const _searchBtn = document.getElementById('searchBtn');
const _mainTable = document.getElementById('main-table');
const _list = document.getElementById('list');
const _inputSearch = document.getElementById('inputSearch');

let isLoggedIn = false;

_searchBtn.addEventListener('click', handleSearchClick);


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
