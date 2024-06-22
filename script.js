const searchBtn = document.getElementById("search");
const typeSearch = document.getElementById("searchInput");
const searchResultsDiv = document.getElementById('search-results');
const displayHistory = document.getElementById("history");
const clear = document.getElementById("clear-history");
const recentSearch = [];

// Fetch the CSV file
const fetchData = async () => {
    try {
        const response = await fetch('https://raw.githubusercontent.com/koine-gloss-database/koine_greek_glosses/master/glosses-en_US.csv');
        const data = await response.text();
        return parseCSV(data);
    } catch (error) {
        console.error('Error fetching CSV:', error);
    }
};

// Parse the CSV data into an array of objects
const parseCSV = (data) => {
    const lines = data.trim().split('\n');
    const headers = lines.shift().split(',').map(header => header.trim());
    return lines.map(line => {
        const values = parseLine(line);
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index] ? values[index].trim() : '';
            return obj;
        }, {});
    });
};

// Function to parse a CSV line, handling commas within quotes
const parseLine = (line) => {
    const values = [];
    let inQuotes = false;
    let value = '';
    for (let char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(value);
            value = '';
        } else {
            value += char;
        }
    }
    values.push(value);
    return values;
};

// Throttle function to limit the rate of function execution
const throttle = (func, delay) => {
    let timeout;
    return (...args) => {
        if (!timeout) {
            timeout = setTimeout(() => {
                func(...args);
                timeout = null;
            }, delay);
        }
    };
};

// Search function
const search = (glosses) => {
    const searchTerm = typeSearch.value.toLowerCase();
    const searchResults = glosses.filter(gloss =>
        Object.values(gloss).some(value => value.toLowerCase().includes(searchTerm))
    );
    displaySearchResults(searchResults);
    updateHistory(searchTerm);
};

// Display search results
const displaySearchResults = (results) => {
    searchResultsDiv.innerHTML = '';
    if (results.length === 0) {
        searchResultsDiv.textContent = 'No results found.';
    } else {
        results.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('result');

            const word = `${result.Word}${result['alternate-spellings'] ? ', ' + result['alternate-spellings'] : ''}${result.transliteration ? ', ' + result.transliteration : ''}`;
            const wordDiv = document.createElement('div');
            wordDiv.textContent = `Word: ${word}`;
            resultDiv.appendChild(wordDiv);

            const glossDiv = document.createElement('div');
            glossDiv.textContent = `Gloss: ${result.Gloss || 'N/A'}`;
            resultDiv.appendChild(glossDiv);

            const strongsDiv = document.createElement('div');
            strongsDiv.textContent = `Strongs: ${result.Strongs || 'N/A'}`;
            resultDiv.appendChild(strongsDiv);

            const frequencyDiv = document.createElement('div');
            const frequency = parseInt(result.frequency, 10);
            frequencyDiv.textContent = `Frequency: ${isNaN(frequency) ? 'N/A' : frequency}`;
            resultDiv.appendChild(frequencyDiv);

            searchResultsDiv.appendChild(resultDiv);
        });
    }
};

// Update search history
const updateHistory = (searchTerm) => {
    if (!recentSearch.includes(searchTerm)) {
        recentSearch.unshift(searchTerm);
        if (recentSearch.length > 10) {
            recentSearch.pop();
        }
        displayHistory.innerHTML = '';
        recentSearch.forEach(term => {
            const historyBox = document.createElement('div');
            historyBox.classList.add('box');
            historyBox.textContent = term;
            historyBox.addEventListener('click', () => {
                typeSearch.value = term;
                fetchData().then(glosses => search(glosses));
            });
            displayHistory.appendChild(historyBox);
        });
    }
};

// Clear search history
const clearHistory = () => {
    recentSearch.splice(0, recentSearch.length);
    displayHistory.innerHTML = '';
    typeSearch.value = '';
    searchResultsDiv.innerHTML = '';
};

// Initialize event listeners
const init = () => {
    fetchData().then(glosses => {
        typeSearch.addEventListener('input', throttle(() => search(glosses), 300));
        typeSearch.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                search(glosses);
            }
        });
        clear.addEventListener('click', clearHistory);
    });
};

init();
