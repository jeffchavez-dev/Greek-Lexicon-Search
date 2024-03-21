const searchBtn = document.getElementById("search")
const typeSearch = document.getElementById("searchInput")
 
 
 // Load the CSV file using fetch
 fetch('https://raw.githubusercontent.com/koine-gloss-database/koine_greek_glosses/master/glosses-en_US.csv')
 .then(response => response.text())
 .then(data => {
   // Parse the CSV data into an array of objects
   const lines = data.trim().split('\n');
   const headers = lines.shift().split(',');
   const glosses = lines.map(line => {
     const values = line.split(',');
     return headers.reduce((obj, header, index) => {
       obj[header] = values[index];
       return obj;
     }, {});
   });

   // Define the search function
function search() {
     const searchTerm = document.getElementById('searchInput').value.toLowerCase();
     const searchResults = glosses.filter(gloss => {
       // Modify the condition based on your search requirements
       return Object.values(gloss).some(value => value.toLowerCase().includes(searchTerm));
     });
     displaySearchResults(searchResults);
   }

searchBtn.addEventListener('click', search)
searchBtn.addEventListener('keyup', search)

   // Function to display search results
function displaySearchResults(results) {
     const searchResultsDiv = document.getElementById('searchResults');
     searchResultsDiv.innerHTML = '';
     if (results.length === 0) {
       searchResultsDiv.textContent = 'No results found.';
     } else {
       results.forEach(result => {
         const resultDiv = document.createElement('div');
         resultDiv.textContent = JSON.stringify(result);
         searchResultsDiv.appendChild(resultDiv);
       });
     }
   }

   // Optionally, you can trigger the search when the user presses Enter in the input field
   document.getElementById('searchInput').addEventListener('keypress', function(event) {
     if (event.key === 'Enter') {
       search();
     }
   });
 })
 .catch(error => console.error('Error fetching CSV:', error));