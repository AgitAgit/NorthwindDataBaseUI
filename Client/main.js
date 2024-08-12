const serverPath = 'http://localhost:5000';
const _searchBtn = document.getElementById('searchBtn');
const _mainTable = document.getElementById('main-table');
const _list = document.getElementById('list');
_searchBtn.addEventListener('click', handleSearchClick);


function getData(){
    return fetch(`${serverPath}/api/data/products`, {
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
    console.log(data);
    displayTable(data);
}

function displayTable(data){
    const rows = data.recordset;
    console.log(rows);
    const numOfCols = Object.keys(rows[0]).length;

    const tableHead = document.createElement("tr");
    _mainTable.appendChild(tableHead);

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

function updateList (){
    for(let i=0;i<5;i++){
        const item = document.createElement("li");
        item.textContent = i;
        _list.appendChild(item);
    }
}
// updateList();