const serverPath = 'http://localhost:5000';
const _searchBtn = document.getElementById('searchBtn');
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
    console.log(await getData());
}