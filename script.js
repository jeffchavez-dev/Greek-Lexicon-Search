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
    typeSearch.addEventListener('input', search)
    const searchResultsDiv = document.getElementById('searchResults');

    // Function to display search results
    function displaySearchResults(results) {
       
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

    const recentSearch = []
    const displayHistory = document.getElementById("history")


    typeSearch.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
        search();
        const historyBox = document.createElement('div')
        const result = searchInput.value

        if (!recentSearch.includes(result)) {
          recentSearch.unshift(result);
          historyBox.classList.add('box')
          
          if (recentSearch.length > 1) {
            recentSearch.splice(1, recentSearch.length)
            historyBox.innerText = recentSearch
            displayHistory.appendChild(historyBox)    
          } else {
            historyBox.innerText = recentSearch
            displayHistory.appendChild(historyBox)
          }

          historyBox.addEventListener('click', () => {
              alert(historyBox.innerText)
              searchInput.value = historyBox.innerText
              search()
          })
        }

        const clear = document.getElementById("clear-history")
        clear.addEventListener('click', () => {
          recentSearch.splice(0, recentSearch.length);
          displayHistory.innerHTML = '';
          typeSearch.value = '';
          console.log(`this is ${typeSearch}`)
          result.innerText = '';
          searchResultsDiv.innerHTML = ''
        })
        
        }



    });
    })
    .catch(error => console.error('Error fetching CSV:', error));