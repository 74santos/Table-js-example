

const spinner = document.getElementById('spinner');
const table = document.getElementById('data-table');
const tableBody = document.getElementById('table-body');
const pagination = document.getElementById('pagination');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageNumber = document.getElementById('page-number');


let data = [];
let sortedData = [];
let currentPage = 1;
const rowsPerPage = 10;
let sortDirection = {};

// Fetch data from API
async function fetchData() {
    spinner.style.display = 'flex';
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await fetch('https://fakerapi.it/api/v1/persons?_quantity=50');
        const json = await response.json();
        data = json.data;
        sortedData = [...data]
        displayTable(data);
        updatedButtons();
    } catch (error) {
        console.error('Error fetching data:' , error);
    } finally {
        spinner.style.display = 'none';
        table.style.display = 'table';
        pagination.style.display = 'block';
    }
}

// Display table data
function displayTable(dataToDisplay)
{    tableBody.innerText = '';
     const start = (currentPage -1) * rowsPerPage;
     const end = start + rowsPerPage;
     //console.log('start', start, 'end',end);
     const paginatedItems = dataToDisplay.slice(start, end);

     
     paginatedItems.forEach(user => {
     const row =
              `<tr>
                <td data-label="Name">${user.firstname} ${user.lastname}</td>
                <td data-label="Email">${user.email}</td>
                <td data-label="Username">${user.address.streetName}</td>
                <td data-label="Country">${user.address.country}</td>
              </tr>`;
              tableBody.insertAdjacentHTML('beforeend', row);        
    });
}

// Sort table by column index
function sortTable(columnIndex) {
  
    clearSortIcons()

   if (!sortDirection[columnIndex]) {
        sortDirection[columnIndex] = 'asc';
   }

    sortedData = [...data].sort((a,b) =>{
        let valA, valB;
        switch (columnIndex) {
            case 0:
                valA = `${a.firstname} ${a.lastname}`;
                valB = `${b.firstname} ${b.lastname}`;
                break;
            case 1:
                valA = a.email;
                valB = b.email;
                break;
            case 2:
                valA = a.address.streetName;
                valB = b.address.streetName;
                break;

             case 3:
                valA = a.address.country;
                valB = b.address.country;       
                break;                  
       }

       if (sortDirection[columnIndex] === 'desc') {
        return valB.localeCompare(valA);
       } else {
        return valA.localeCompare(valB);
       }

    });

    sortDirection[columnIndex] = sortDirection[columnIndex] === 'asc' ? 'desc' : 'asc';
    //console.log(sortDirection);

    updateSortIcon(columnIndex, sortDirection[columnIndex]);
    
    displayTable(sortedData);
}

//Clear sort icons for all columns
function clearSortIcons() {
    for (let i = 0; i < 4; i++) {
        const icon = document.getElementById(`icon-${i}`);
        icon.className = 'fas fa-sort';
        
    }
}

//update the sort icon based on sortDirection
function updateSortIcon(columnIndex, direction) {
    const icon = document.getElementById(`icon-${columnIndex}`);
    icon.className = direction === 'asc' ? 'fas fa-sort-down' : 'fas fa-sort-up';
}


// Previous Page
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayTable(sortedData);
        updatedButtons();
        
    }
}

// Next Page
function nextPage() {
    if (currentPage * rowsPerPage < sortedData.length) {
        currentPage++;
        displayTable(sortedData);
        updatedButtons();
    }
}

//Updated pagination buttons
function updatedButtons() {
    pageNumber.innerText = currentPage;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage * rowsPerPage >= sortedData.length;
}



//Starup
fetchData();




//Dark Mode Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;


// Check if dark mode is preffered or previously chosen

const isDarkMode = localStorage.getItem('dark-mode') === 'true';

// Set initial mode
if (isDarkMode) {
    body.classList.add('dark-mode');
    themeToggle.innerText = 'Light Mode';

}

// Toggle dark mode and updated text
themeToggle.addEventListener('click', ()=> {

    body.style.transition = 'background-color 0.3s, color 0.3s';
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        themeToggle.innerText = 'Dark Mode';
        localStorage.setItem('dark-mode', 'false');
    } else {
        body.classList.add('dark-mode');
        themeToggle.innerText = 'Light Mode';
        localStorage.setItem('dark-mode', 'true');
    }
});